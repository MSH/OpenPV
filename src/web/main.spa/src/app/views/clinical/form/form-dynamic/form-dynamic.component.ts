import { AfterViewInit, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { DatePipe, Location } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PopupService } from 'app/shared/services/popup.service';
import { egretAnimations } from 'app/shared/animations/egret-animations';
import { AccountService } from 'app/shared/services/account.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'app/shared/base/base.component';
import { EventService } from 'app/shared/services/event.service';
import { PatientService } from 'app/shared/services/patient.service';
import { finalize, takeUntil, switchMap } from 'rxjs/operators';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AttachmentAddPopupComponent } from '../../shared/attachment-add-popup/attachment-add.popup.component';
import { FormAttachmentModel } from 'app/shared/models/form/form-attachment.model';
import { GridModel } from 'app/shared/models/grid.model';
import { PatientMedicationForUpdateModel } from 'app/shared/models/patient/patient-medication-for-update.model';
import { forkJoin, Observable, of} from 'rxjs';
import { CustomAttributeDetailModel } from 'app/shared/models/custom-attribute/custom-attribute.detail.model';
import { CustomAttributeService } from 'app/shared/services/custom-attribute.service';
import { _routes } from 'app/config/routes';
import { AttributeValueForPostModel } from 'app/shared/models/custom-attribute/attribute-value-for-post.model';
import { FormADRMedicationPopupComponent } from '../../shared/form-adr-medication-popup/form-adr-medication.popup.component';
import { MetaFormService } from 'app/shared/services/meta-form.service';
import { FormCompletePopupComponent } from '../form-complete-popup/form-complete.popup.component';

// Depending on whether rollup is used, moment needs to be imported differently.
// Since Moment.js doesn't have a default export, we normally need to import using the `* as`
// syntax. However, rollup creates a synthetic default module and we thus need to import it using
// the `default as` syntax.
import * as _moment from 'moment';
import { MetaFormExpandedModel } from 'app/shared/models/meta/meta-form.expanded.model';
import { MetaFormCategoryAttributeModel } from 'app/shared/models/meta/meta-form-category-attribute.model';
import { PatientLabTestForUpdateModel } from 'app/shared/models/patient/patient-lab-test-for-update.model';
import { FormDynamicLabsPopupComponent } from './form-dynamic-labs-popup/form-dynamic-labs.popup.component';
import { PatientForCreationModel } from 'app/shared/models/patient/patient-for-creation.model';
import { PatientConditionForUpdateModel } from 'app/shared/models/patient/patient-condition-for-update.model';
import { FormDynamicConditionsPopupComponent } from './form-dynamic-conditions-popup/form-dynamic-conditions.popup.component';
import { PatientClinicalEventForUpdateModel } from 'app/shared/models/patient/patient-clinical-event-for-update.model';
import { FormDynamicAdversePopupComponent } from './form-dynamic-adverse-popup/form-dynamic-adverse.popup.component';

const moment =  _moment;

@Component({
  templateUrl: './form-dynamic.component.html',
  styles: [`
    .mat-column-file-name { flex: 0 0 85% !important; width: 85% !important; }
    .mat-column-actions { flex: 0 0 5% !important; width: 5% !important; }
  `],   
  animations: egretAnimations
})
export class FormDynamicComponent extends BaseComponent implements OnInit, AfterViewInit, OnDestroy {
  // @HostListener allows us to also guard against browser refresh, close, etc.
  @HostListener('window:beforeunload')
  
  public scrollConfig = {}

  viewModel: ViewModel = new ViewModel();

  public viewModelForm: FormGroup;

  constructor(
    protected _activatedRoute: ActivatedRoute,
    protected _router: Router,
    protected _location: Location,
    protected _formBuilder: FormBuilder,
    protected popupService: PopupService,
    protected accountService: AccountService,
    protected eventService: EventService,
    protected patientService: PatientService,
    protected customAttributeService: CustomAttributeService,
    protected metaFormService: MetaFormService,
    protected dialog: MatDialog,
    protected datePipe: DatePipe) 
  { 
    super(_router, _location, popupService, accountService, eventService);
  }

  canDeactivate(): Observable<boolean> | boolean {
    // returning true will navigate without confirmation
    // returning false will show a confirm dialog before navigating away
    const arrayControl = <FormArray>this.viewModelForm.controls["formArray"];
    var isClean = true;
    arrayControl.controls.forEach(formGroup => {
      if(!formGroup.pristine) {
        isClean = false;
      };      
    });

    return isClean;
  }  

  ngOnInit(): void {
    const self = this;

    self.initialisetFormView();    
    
    self.accountService.connected$.subscribe(val => {
      self.viewModel.connected = val;
    });
    
    self.getCustomAttributeList();

    self.viewModel.attachmentGrid.setupBasic(null, null, null);    
  }

  initialisetFormView(): void {
    // Set default values and re-fetch any data you need.
    const self = this;

    self.viewModel.metaFormId = +self._activatedRoute.snapshot.paramMap.get('metaFormId');
    self.viewModel.formId = +self._activatedRoute.snapshot.paramMap.get('formId');
    self.fetchView();

    self.viewModelForm = this._formBuilder.group({
      formArray: this._formBuilder.array([])
    })    
  }    

  ngAfterViewInit(): void {
    let self = this;
    if (self.viewModel.formId > 0) {
       self.loadFormData();
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
    this.eventService.removeAll(FormDynamicComponent.name);
  }   

  nextStep(): void {
    this.markCurrentFormsAsTouched();
    this.viewModel.currentStep ++;
  }

  previousStep(): void {
    if(this.viewModel.currentStep < this.viewModel?.metaForm?.categories.length) {
      this.markCurrentFormsAsTouched();
    }
    this.viewModel.currentStep --;
  }

  fetchView(): void {
    let self = this;
    self.setBusy(true);
    self.metaFormService.getMetaForm(self.viewModel.metaFormId, 'expandedwithoutunmappedattributes')
      .pipe(takeUntil(self._unsubscribeAll))
      .pipe(finalize(() => self.setBusy(false)))
      .subscribe(result => {
        self.viewModel.metaForm = result;
        self.prepareFormArray();
        self.CLog(result, 'result');
      }, error => {
        self.handleError(error, "Error fetching meta form");
      });
  }  

  loadFormData(): void {
    let self = this;
    self.setBusy(true);

    // self.metaFormService.getForm(self.viewModel.formId).then(result => {
    //     let form = result as Form;
    //     self.CLog(form, 'form');
        
    //     self.viewModel.formIdentifier = form.formIdentifier;

    //     self.updateForm(self.viewModelForm, JSON.parse(form.formValues[0].formControlValue));
    //     self.updateForm(self.firstFormGroup, JSON.parse(form.formValues[1].formControlValue));
    //     self.updateForm(self.thirdFormGroup, JSON.parse(form.formValues[2].formControlValue));
    //     self.updateForm(self.fourthFormGroup, JSON.parse(form.formValues[3].formControlValue));
    //     self.updateForm(self.sixthFormGroup, JSON.parse(form.formValues[5].formControlValue));

    //     self.viewModel.medications = JSON.parse(form.formValues[4].formControlValue);
    //     self.viewModel.medicationGrid.updateBasic(self.viewModel.medications);

    //     form.formAttachments.forEach(attachment => {
    //       self.viewModel.attachments.push({ description: attachment.description, file: attachment.file })  
    //     });
    //     self.viewModel.attachmentGrid.updateBasic(self.viewModel.attachments);            

    //     self.viewModel.patientFound = true;
    //     self.viewModel.isComplete = form.completeStatus == 'Complete';
    //     self.viewModel.isSynched = form.synchStatus == 'Synched';

    //     if(self.viewModel.isSynched) {
    //       self.firstFormGroup.disable();
    //       self.thirdFormGroup.disable();
    //       self.fourthFormGroup.disable();
    //       self.sixthFormGroup.disable();
    //     }

    // self.markAllFormsAsTouched();

    //     self.setBusy(false);
    // }, error => {
    //       self.throwError(error, error.statusText);
    // });
  }

  getCustomAttributeList(): void {
    let self = this;

    const requestArray = [];

    requestArray.push(self.customAttributeService.getAllCustomAttributes('PatientLabTest'));
    requestArray.push(self.customAttributeService.getAllCustomAttributes('PatientMedication'));
    requestArray.push(self.customAttributeService.getAllCustomAttributes('PatientClinicalEvent'));
    requestArray.push(self.customAttributeService.getAllCustomAttributes('Patient'));

    forkJoin(requestArray)
      .pipe(
        switchMap((values: any[]) => {
          const mergeAttributeList: CustomAttributeDetailModel[] = [];

          values[0].forEach((attribute) => {
            mergeAttributeList.push(attribute);
          });
          values[1].forEach((attribute) => {
            mergeAttributeList.push(attribute);
          });
          values[2].forEach((attribute) => {
            mergeAttributeList.push(attribute);
          });
          values[3].forEach((attribute) => {
            mergeAttributeList.push(attribute);
          });

          return of(mergeAttributeList);
        })
      )
      .subscribe(
        data => {
          self.viewModel.customAttributeList = data;
        },
        error => {
          this.handleError(error, "Error loading attributes");
        });    
  }  

  openAttachmentPopUp() {
    let self = this;
    let title = 'Add Attachment';
    let dialogRef: MatDialogRef<any> = self.dialog.open(AttachmentAddPopupComponent, {
      width: '720px',
      disableClose: true,
      data: { title: title }
    })
    dialogRef.afterClosed()
      .subscribe(res => {
        if(!res) {
          // If user press cancel
          return;
        }
        self.viewModel.attachments.push(res);
        self.viewModel.attachmentGrid.updateBasic(self.viewModel.attachments);
      })
  }

  removeAttachment(index: number): void {
    let self = this;
    self.viewModel.attachments.splice(index, 1)
    self.viewModel.attachmentGrid.updateBasic(self.viewModel.attachments);    

    this.notify("Attachment removed successfully!", "Success");
  }
  
  openMedicationPopup(data: any = {}, isNew?) {
    let self = this;
    let title = isNew ? 'Add Medication' : 'Update Medication';
    let indexToUse = isNew ? self.viewModel.medications.length + 1 : data.index;
    
    let existingMedication = null;
    if (!isNew) {
      let actualIndex = self.viewModel.medications.findIndex(m => m.index == indexToUse);
      self.CLog(actualIndex, 'actual index');
      existingMedication = self.viewModel.medications[actualIndex];
    }
    
    let dialogRef: MatDialogRef<any> = self.dialog.open(FormADRMedicationPopupComponent, {
      width: '920px',
      disableClose: true,
      data: { title: title, medicationId: isNew ? 0: existingMedication.id, index: indexToUse, existingMedication }
    })
    dialogRef.afterClosed()
      .subscribe(res => {
        if(!res) {
          // If user press cancel
          return;
        }
        if(isNew) {
          self.viewModel.medications.push(res);
        }
        else {
          let actualIndex = self.viewModel.medications.findIndex(m => m.index == indexToUse);
          self.viewModel.medications[actualIndex] = res;
        }
    
        self.viewModel.medicationGrid.updateBasic(self.viewModel.medications);
        // self.fifthFormGroup.reset();
      })
  }

  removeMedication(index: number): void {
    let self = this;

    let actualIndex = self.viewModel.medications.findIndex(m => m.index == index);
    self.viewModel.medications.splice(actualIndex, 1)
    this.viewModel.medicationGrid.updateBasic(self.viewModel.medications);

    this.notify("Medication removed successfully!", "Medication");
  }

  openLabPopup(data: any = {}, isNew?) {
    let self = this;
    let title = isNew ? 'Add Test and Procedure' : 'Update Test and Procedure';
    let indexToUse = isNew ? self.viewModel.labTests.length + 1 : data.index;
    
    let existingLabTest = null;
    if (!isNew) {
      let actualIndex = self.viewModel.labTests.findIndex(m => m.index == indexToUse);
      self.CLog(actualIndex, 'actual index');
      existingLabTest = self.viewModel.labTests[actualIndex];
    }
    
    let dialogRef: MatDialogRef<any> = self.dialog.open(FormDynamicLabsPopupComponent, {
      width: '920px',
      disableClose: true,
      data: { title: title, labTestId: isNew ? 0: existingLabTest.id, index: indexToUse, existingLabTest }
    })
    dialogRef.afterClosed()
      .subscribe(res => {
        if(!res) {
          // If user press cancel
          return;
        }
        if(isNew) {
          self.viewModel.labTests.push(res);
        }
        else {
          let actualIndex = self.viewModel.labTests.findIndex(m => m.index == indexToUse);
          self.viewModel.labTests[actualIndex] = res;
        }
    
        self.viewModel.labTestGrid.updateBasic(self.viewModel.labTests);
        // self.fifthFormGroup.reset();
      })
  }

  removeLabTest(index: number): void {
    let self = this;

    let actualIndex = self.viewModel.labTests.findIndex(m => m.index == index);
    self.viewModel.labTests.splice(actualIndex, 1)
    this.viewModel.labTestGrid.updateBasic(self.viewModel.labTests);

    this.notify("Test and procedure removed successfully!", "Test and Procedure");
  }

  openConditionPopup(data: any = {}, isNew?) {
    let self = this;
    let title = isNew ? 'Add Condition' : 'Update Condition';
    let indexToUse = isNew ? self.viewModel.conditions.length + 1 : data.index;

    let existingCondition = null;
    if (!isNew) {
      let actualIndex = self.viewModel.conditions.findIndex(c => c.index == indexToUse);
      existingCondition = self.viewModel.conditions[actualIndex];
    }

    let dialogRef: MatDialogRef<any> = self.dialog.open(FormDynamicConditionsPopupComponent, {
      width: '720px',
      disableClose: true,
      data: { title: title, conditionId: isNew ? 0: existingCondition.id, index: indexToUse, existingCondition }
    })
    dialogRef.afterClosed()
      .subscribe(res => {
        if(!res) {
          // If user press cancel
          return;
        }
        if(isNew) {
          self.viewModel.conditions.push(res);
        }
        else {
          let actualIndex = self.viewModel.conditions.findIndex(c => c.index == indexToUse);
          self.viewModel.conditions[actualIndex] = res;
        }

        this.viewModel.conditionGrid.updateBasic(this.viewModel.conditions);
        //this.viewConditionModelForm.reset();
      })
  }

  removeCondition(index: number): void {
    let self = this;

    let actualIndex = self.viewModel.conditions.findIndex(m => m.index == index);
    self.viewModel.conditions.splice(actualIndex, 1)
    this.viewModel.conditionGrid.updateBasic(self.viewModel.conditions);

    this.notify("Condition removed successfully!", "Condition");
  }
  
  openAdversePopup(data: any = {}, isNew?) {
    let self = this;
    let title = isNew ? 'Add Adverse Event' : 'Update Adverse Event';
    let indexToUse = isNew ? self.viewModel.adverseEvents.length + 1 : data.index;
    
    let existingClinicalEvent = null;
    if (!isNew) {
      let actualIndex = self.viewModel.adverseEvents.findIndex(m => m.index == indexToUse);
      existingClinicalEvent = self.viewModel.adverseEvents[actualIndex];
    }

    let dialogRef: MatDialogRef<any> = self.dialog.open(FormDynamicAdversePopupComponent, {
      width: '720px',
      disableClose: true,
      data: { title: title, clinicalEventId: isNew ? 0: existingClinicalEvent.id, index: indexToUse, existingClinicalEvent }
    })
    dialogRef.afterClosed()
      .subscribe(res => {
        if(!res) {
          // If user press cancel
          return;
        }
        if(isNew) {
          self.viewModel.adverseEvents.push(res);
        }
        else {
          let actualIndex = self.viewModel.adverseEvents.findIndex(m => m.index == indexToUse);
          self.viewModel.adverseEvents[actualIndex] = res;
        }

        this.viewModel.adverseEventGrid.updateBasic(this.viewModel.adverseEvents);
        //this.viewAdverseEventModelForm.reset();
    })
  }  

  removeAdverseEvent(index: number): void {
    let self = this;

    let actualIndex = self.viewModel.adverseEvents.findIndex(m => m.index == index);
    self.viewModel.adverseEvents.splice(actualIndex, 1)
    this.viewModel.adverseEventGrid.updateBasic(self.viewModel.adverseEvents);

    this.notify("Adverse event removed successfully!", "Adverse Event");
  }

  saveFormOnline(): void {
    let self = this;

    var patientForCreationModel = self.preparePatientForCreationModel();
    self.CLog(patientForCreationModel, 'patientForCreationModel');
    self.patientService.savePatient(patientForCreationModel)
      .pipe(finalize(() => self.setBusy(false)))
      .subscribe(result => {
        self.CLog(result, 'saved');

        self.saveOnlinePatientComplete(result.id);
      }, error => {
        this.handleError(error, "Error saving patient");
      });   
  }

  checkFormError(index: number): boolean {
    let self = this;

    const arrayControl = <FormArray>this.viewModelForm.controls["formArray"];
    const formGroup = arrayControl.controls[index];
    return formGroup.invalid;
  }

  checkAnyFormError(): boolean {
    let self = this;

    const arrayControl = <FormArray>this.viewModelForm.controls["formArray"];
    var hasError = false;
    arrayControl.controls.forEach(formGroup => {
      if(formGroup.invalid) {
        hasError = true;
      };
    });

    return hasError;
  }

  private preparePatientForCreationModel(): PatientForCreationModel {
    let self = this;

    const attributesForUpdate: AttributeValueForPostModel[] = [];

    let categoryIndex = 0;
    self.viewModel.metaForm.categories.forEach(category => {
      if(category.metaTableName == 'Patient') {
        category.attributes.filter(a => a.attributeId != null).forEach(attribute => {
          self.prepareAttributeValue(attributesForUpdate, attribute.attributeName, attribute.id.toString(), categoryIndex);
        })
      }
      categoryIndex ++;
    })    

    let currentDate = new Date();
    let enroledDate = this.datePipe.transform(currentDate, 'yyyy-MM-dd');

    const patientForCreationModel: PatientForCreationModel = 
    {
      firstName: '',
      lastName: '',
      middleName: '',
      dateOfBirth: currentDate,
      facilityName: '',
      conditionGroupId: 1,
      meddraTermId: 1,
      cohortGroupId: 1,
      enroledDate: enroledDate,
      startDate: enroledDate,
      caseNumber: '',
      comments: '',
      encounterTypeId: 1,
      priorityId: 1,
      encounterDate: enroledDate,
      attributes: attributesForUpdate
    };
    self.prepareFirstClassValues(patientForCreationModel);

    return patientForCreationModel;
  }

  private prepareAttributeValue(attributesForUpdate : AttributeValueForPostModel[], attributeKey: string, formKey: string, formId: number) {
    const self = this;
    let customAttribute = self.viewModel.customAttributeList.find(ca => ca.attributeKey.toLowerCase() == attributeKey.toLowerCase());
    self.CLog(customAttribute, 'customAttribute ' + attributeKey);
    if(customAttribute == null) {
      return null;
    }

    let fieldValue = this.getFormValue(formId, formKey);
    // console.log(fieldValue, 'fieldValue');
    if(fieldValue != null) {
      const attributeForPost: AttributeValueForPostModel = {
        id: customAttribute.id,
        value: fieldValue
      }
      
      attributesForUpdate.push(attributeForPost);
    }
  }

  private prepareFirstClassValues(patientForCreationModel: PatientForCreationModel) {
    const self = this;

    let categoryIndex = 0;
    self.viewModel.metaForm.categories.forEach(category => {
      if(category.metaTableName == 'Patient') {
        let attribute = category.attributes.filter(a => a.attributeId == null && a.attributeName == 'FirstName')[0];
        if(attribute != null) {
          let fieldValue = this.getFormValue(categoryIndex, attribute.id.toString());

          if(fieldValue != null) {
            patientForCreationModel.firstName = fieldValue;
          }
        }
      }
      categoryIndex ++;
    })

    categoryIndex = 0;
    self.viewModel.metaForm.categories.forEach(category => {
      if(category.metaTableName == 'Patient') {
        let attribute = category.attributes.filter(a => a.attributeId == null && a.attributeName == 'Surname')[0];
        if(attribute != null) {
          let fieldValue = this.getFormValue(categoryIndex, attribute.id.toString());

          if(fieldValue != null) {
            patientForCreationModel.lastName = fieldValue;
          }
        }
      }
      categoryIndex ++;
    })

    categoryIndex = 0;
    self.viewModel.metaForm.categories.forEach(category => {
      if(category.metaTableName == 'Patient') {
        let attribute = category.attributes.filter(a => a.attributeId == null && a.attributeName == 'DateOfBirth')[0];
        if(attribute != null) {
          let fieldValue = this.getFormValue(categoryIndex, attribute.id.toString());

          if(fieldValue != null) {
            patientForCreationModel.dateOfBirth = fieldValue.format("YYYY-MM-DD");
          }
        }
      }
      categoryIndex ++;
    })

    categoryIndex = 0;
    self.viewModel.metaForm.categories.forEach(category => {
      if(category.metaTableName == 'Patient') {
        let attribute = category.attributes.filter(a => a.attributeId != null && a.attributeName == 'Code ASS du patient')[0];
        if(attribute != null) {
          let fieldValue = this.getFormValue(categoryIndex, attribute.id.toString());

          if(fieldValue != null) {
            patientForCreationModel.caseNumber = fieldValue;
          }
        }
      }
      categoryIndex ++;
    })

    categoryIndex = 0;
    self.viewModel.metaForm.categories.forEach(category => {
      if(category.metaTableName == 'Patient') {
        let attribute = category.attributes.filter(a => a.attributeId == null && a.attributeName == 'PatientFacilities')[0];
        if(attribute != null) {
          let fieldValue = this.getFormValue(categoryIndex, attribute.id.toString());

          if(fieldValue != null) {
            self.CLog(fieldValue, 'facilities')
            patientForCreationModel.facilityName = fieldValue;
          }
        }
      }
      categoryIndex ++;
    })

  }

  private getFormValue(formId: number, attributeId: string) {
    const arrayControl = <FormArray>this.viewModelForm.controls["formArray"];
    return arrayControl.controls[formId].get('attributes.' + attributeId.toString())?.value;
  }

  private saveOnlinePatientComplete(patientId: number): void {
    const self = this;
    const requestArray = [];

    self.viewModel.medications.forEach(medicationForUpdate => {
      requestArray.push(self.patientService.savePatientMedication(patientId, medicationForUpdate.id, medicationForUpdate));
    });

    self.viewModel.conditions.forEach(conditionForUpdate => {
      requestArray.push(self.patientService.savePatientCondition(patientId, conditionForUpdate.id, conditionForUpdate));
    });

    self.viewModel.labTests.forEach(labTestForUpdate => {
      requestArray.push(self.patientService.savePatientLabTest(patientId, labTestForUpdate.id, labTestForUpdate));
    });

    self.viewModel.adverseEvents.forEach(adverseEventForUpdate => {
      requestArray.push(self.patientService.savePatientClinicalEvent(patientId, adverseEventForUpdate.id, adverseEventForUpdate));
    });

    const arrayControl = <FormArray>this.viewModelForm.controls["formArray"];
    arrayControl.controls.forEach(formGroup => {
      formGroup.markAsPristine();
    });
    self.CLog(requestArray, 'requestArray');

    if(requestArray.length > 0) {
      forkJoin(requestArray)
        .subscribe(
          data => {
            self.setBusy(false);
            self.notify('Form saved successfully!', 'Success');
          },
          error => {
            this.handleError(error, "Error saving form");
          });
    }
    else {
      self.setBusy(false);
      self.notify('Form saved successfully!', 'Success');
    }

    self._router.navigate([_routes.clinical.forms.landing]);
  }

  private markCurrentFormsAsTouched(): void {
    let self = this;

    const arrayControl = <FormArray>this.viewModelForm.controls["formArray"];
    const formGroup = arrayControl.controls[self.viewModel.currentStep];
    self.markFormGroupTouched(formGroup as FormGroup);
  }  
  
  saveFormOffline(): void {
    const self = this;
    let otherModels:any[]; 
    // otherModels = [self.thirdFormGroup.value, self.fourthFormGroup.value, self.viewModel.medications, self.sixthFormGroup.value];

    // if (self.viewModel.formId == 0) {
    //   self.metaFormService.saveFormToDatabase('FormADR', self.viewModelForm.value, self.firstFormGroup.value, self.viewModel.attachments, otherModels).then(response =>
    //     {
    //       if (response) {
    //         self.setBusy(false);              
    //         self.notify('Form saved successfully!', 'Form Saved');

    //         self.firstFormGroup.markAsPristine();
    //         self.thirdFormGroup.markAsPristine();
    //         self.fourthFormGroup.markAsPristine();
    //         self.fifthFormGroup.markAsPristine();
    //         self.sixthFormGroup.markAsPristine();
    
    //         self._router.navigate([_routes.clinical.forms.landing]);
    //       }
    //       else {
    //         self.showError('There was an error saving the form locally, please try again !', 'Form Error');
    //       }
    //     });
    //   }
    //   else {
    //     self.metaFormService.updateForm(self.viewModel.formId, this.viewModelForm.value, this.firstFormGroup.value, self.viewModel.attachments, otherModels).then(response =>
    //       {
    //           if (response) {
    //               self.notify('Form updated successfully!', 'Form Saved');

    //               self.firstFormGroup.markAsPristine();
    //               self.thirdFormGroup.markAsPristine();
    //               self.fourthFormGroup.markAsPristine();
    //               self.fifthFormGroup.markAsPristine();
    //               self.sixthFormGroup.markAsPristine();
      
    //               self._router.navigate([_routes.clinical.forms.landing]);
    //           }
    //           else {
    //               self.showError('There was an error saving the form locally, please try again !', 'Form Error');
    //           }
    //       });
    //   }
  }

  completeFormOffline(): void {
    let self = this;
    let otherModels:any[];

    // otherModels = [self.thirdFormGroup.value, self.fourthFormGroup.value, self.viewModel.medications, self.sixthFormGroup.value];

    // if (self.viewModel.formId == 0) {
    //   self.metaFormService.saveFormToDatabase('FormADR', self.viewModelForm.value, self.firstFormGroup.value, self.viewModel.attachments, otherModels).then(response =>
    //     {
    //         if (response) {
    //           self.setBusy(false);              
    //           self.notify('Form saved successfully!', 'Form Saved');
  
    //           self.firstFormGroup.markAsPristine();
    //           self.thirdFormGroup.markAsPristine();
    //           self.fourthFormGroup.markAsPristine();
    //           self.fifthFormGroup.markAsPristine();
    //           self.sixthFormGroup.markAsPristine();
      
    //           self.openCompletePopup(+response);
    //         }
    //         else {
    //             self.showError('There was an error saving the form locally, please try again !', 'Form Error');
    //         }
    //     });
    //   }
    //   else {
    //     self.metaFormService.updateForm(self.viewModel.formId, this.viewModelForm.value, this.firstFormGroup.value, self.viewModel.attachments, otherModels).then(response =>
    //       {
    //           if (response) {
    //               self.notify('Form updated successfully!', 'Form Saved');

    //               self.firstFormGroup.markAsPristine();
    //               self.thirdFormGroup.markAsPristine();
    //               self.fourthFormGroup.markAsPristine();
    //               self.fifthFormGroup.markAsPristine();
    //               self.sixthFormGroup.markAsPristine();
    
    //               this.openCompletePopup(self.viewModel.formId);
    //             }
    //           else {
    //               self.showError('There was an error updating the form locally, please try again !', 'Form Error');
    //           }
    //       });
    //   }
  } 

  filterSelectedAttributes(selected: boolean, attributes: any[]): any[] {
    return attributes.filter(a => a.selected == selected);
  }

  attributeHasRequiredError(stepForm: FormGroup, attribute: MetaFormCategoryAttributeModel): boolean {
    return stepForm.get('attributes.' + attribute.id.toString())?.hasError('required');
  }

  attributeHasMinRangeError(stepForm: FormGroup, attribute: MetaFormCategoryAttributeModel): boolean {
    return stepForm.get('attributes.' + attribute.id.toString())?.hasError('min');
  }  

  attributeHasMaxRangeError(stepForm: FormGroup, attribute: MetaFormCategoryAttributeModel): boolean {
    return stepForm.get('attributes.' + attribute.id.toString())?.hasError('max');
  }

  attributeHasMaxLengthError(stepForm: FormGroup, attribute: MetaFormCategoryAttributeModel): boolean {
    return stepForm.get('attributes.' + attribute.id.toString())?.hasError('maxlength');
  }   

  private prepareFormArray(): void {
    let self = this;
    self.viewModel.metaForm.categories.forEach(category => {
      // add form group per category
      let newGroup = self.addGroupForCategory();
      let attributes = newGroup.get('attributes') as FormGroup;

      category.attributes.forEach(attribute => {
        // Add elements to form group
        let validators = [ ];
        if(attribute.required) {
           validators.push(Validators.required);
        }
        if(attribute.stringMaxLength != null && attribute.stringMaxLength > 0) {
           validators.push(Validators.maxLength(attribute.stringMaxLength));
        }
        if(attribute.numericMinValue != null && attribute.numericMinValue > 0 && attribute.numericMaxValue != null && attribute.numericMaxValue > 0) {
           validators.push(Validators.max(attribute.numericMaxValue));
           validators.push(Validators.min(attribute.numericMinValue));
        }

        attributes.addControl(attribute.id.toString(), new FormControl(null, validators));
      })
    })
  }

  private addGroupForCategory(): FormGroup {
    const arrayControl = <FormArray>this.viewModelForm.controls["formArray"];
    let newGroup = this._formBuilder.group({
      attributes: this._formBuilder.group([]),
    });
    arrayControl.push(newGroup);
    return newGroup;
  }  

  private openCompletePopup(formId: number) {
    let self = this;
    let title = "Form Completed";
    let dialogRef: MatDialogRef<any> = self.dialog.open(FormCompletePopupComponent, {
      width: '720px',
      disableClose: true,
      data: { formId, title }
    })
    dialogRef.afterClosed()
      .subscribe(res => {
        if(!res) {
          // If user press cancel
          return;
        }        
        self._router.navigate([_routes.clinical.forms.landing]);        
      })
  }    
}

class ViewModel {
  metaFormId: number;
  formId: number;
  formIdentifier: string;
  
  metaForm: MetaFormExpandedModel;
    
  patientId: number;
  patientFound = false;
  errorFindingPatient = false;

  currentStep = 0;
  isComplete = false;
  isSynched = false;
  connected: boolean = true;
  saving: boolean = false;

  customAttributeKey = 'Case Number';
  customAttributeList: CustomAttributeDetailModel[] = [];
  reporterCustomAttributeList: CustomAttributeDetailModel[] = [];
  managementCustomAttributeList: CustomAttributeDetailModel[] = [];
  detailCustomAttributeList: CustomAttributeDetailModel[] = [];
  clinicalCustomAttributeList: CustomAttributeDetailModel[] = [];
 
  attachmentGrid: GridModel<FormAttachmentModel> =
    new GridModel<FormAttachmentModel>
        (['file-name', 'actions']);
  attachments: FormAttachmentModel[] = [];

  medicationGrid: GridModel<MedicationGridRecordModel> =
  new GridModel<MedicationGridRecordModel>
      (['medication', 'start-date', 'end-date', 'dose', 'actions']);
  medications: PatientMedicationForUpdateModel[] = [];

  conditionGrid: GridModel<ConditionGridRecordModel> =
  new GridModel<ConditionGridRecordModel>
      (['condition', 'actions']);
  conditions: PatientConditionForUpdateModel[] = [];

  labTestGrid: GridModel<LabTestGridRecordModel> =
  new GridModel<LabTestGridRecordModel>
      (['lab-test', 'test-date', 'test-result', 'actions']);
  labTests: PatientLabTestForUpdateModel[] = [];

  adverseEventGrid: GridModel<AdverseEventGridRecordModel> =
  new GridModel<AdverseEventGridRecordModel>
      (['adverse-event', 'onset-date', 'resolution-date', 'actions']);
  adverseEvents: PatientClinicalEventForUpdateModel[] = [];

}

class ConditionGridRecordModel {
  id: number;
  index: number;
  condition: string;
}

class LabTestGridRecordModel {
  index: number;
  labTest: string;
  testDate: string;
  testResultValue: string;
}

class MedicationGridRecordModel {
  id: number;
  index: number;
  medication: string;
  dose: string;
  doseUnit: string;
  startDate: string;
  endDate: string;
}

class AdverseEventGridRecordModel {
  id: number;
  index: number;
  sourceDescription: string;
  onsetDate: string;
  resolutionDate?: string;
}