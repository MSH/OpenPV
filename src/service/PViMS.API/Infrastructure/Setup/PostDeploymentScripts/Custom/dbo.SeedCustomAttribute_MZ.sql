/**************************************************************************************************************************
**
**	Function: SEED CUSTOM ATTRIBUTES : Mozambique Implementation
**
***************************************************************************************************************************/

-- *** PATIENT
INSERT [dbo].[CustomAttributeConfiguration] ([ExtendableTypeName], [CustomAttributeType], [Category], [AttributeKey], [IsRequired], [StringMaxLength], [NumericMinValue], [NumericMaxValue], [FutureDateOnly], [PastDateOnly], [IsSearchable], [AttributeDetail]) 
	VALUES (N'Patient', 2, N'Custom', N'Medical Record Number', 1, 50, NULL, NULL, 0, 0, 1, NULL)

INSERT [dbo].[CustomAttributeConfiguration] ([ExtendableTypeName], [CustomAttributeType], [Category], [AttributeKey], [IsRequired], [StringMaxLength], [NumericMinValue], [NumericMaxValue], [FutureDateOnly], [PastDateOnly], [IsSearchable], [AttributeDetail]) 
	VALUES (N'Patient', 2, N'Custom', N'Patient Identity Number', 1, 20, NULL, NULL, 0, 0, 0, NULL)

INSERT [dbo].[CustomAttributeConfiguration] ([ExtendableTypeName], [CustomAttributeType], [Category], [AttributeKey], [IsRequired], [StringMaxLength], [NumericMinValue], [NumericMaxValue], [FutureDateOnly], [PastDateOnly], [IsSearchable], [AttributeDetail]) 
	VALUES (N'Patient', 3, N'Custom', N'Identity Type', 0, NULL, NULL, NULL, 0, 0, 0, NULL)
INSERT [dbo].[SelectionDataItem] ([AttributeKey], [SelectionKey], [Value]) 
	VALUES (N'Identity Type', N'0', N'')
INSERT [dbo].[SelectionDataItem] ([AttributeKey], [SelectionKey], [Value]) 
	VALUES (N'Identity Type', N'1', N'National identity')
INSERT [dbo].[SelectionDataItem] ([AttributeKey], [SelectionKey], [Value]) 
	VALUES (N'Identity Type', N'2', N'Passport number')
INSERT [dbo].[SelectionDataItem] ([AttributeKey], [SelectionKey], [Value]) 
	VALUES (N'Identity Type', N'3', N'Work permit number')

INSERT [dbo].[CustomAttributeConfiguration] ([ExtendableTypeName], [CustomAttributeType], [Category], [AttributeKey], [IsRequired], [StringMaxLength], [NumericMinValue], [NumericMaxValue], [FutureDateOnly], [PastDateOnly], [IsSearchable], [AttributeDetail]) 
	VALUES (N'Patient', 3, N'Custom', N'Gender', 1, NULL, NULL, NULL, 0, 0, 0, NULL)
INSERT [dbo].[SelectionDataItem] ([AttributeKey], [SelectionKey], [Value]) 
	VALUES (N'Gender', N'0', N'')
INSERT [dbo].[SelectionDataItem] ([AttributeKey], [SelectionKey], [Value]) 
	VALUES (N'Gender', N'1', N'Male')
INSERT [dbo].[SelectionDataItem] ([AttributeKey], [SelectionKey], [Value]) 
	VALUES (N'Gender', N'2', N'Female')

INSERT [dbo].[CustomAttributeConfiguration] ([ExtendableTypeName], [CustomAttributeType], [Category], [AttributeKey], [IsRequired], [StringMaxLength], [NumericMinValue], [NumericMaxValue], [FutureDateOnly], [PastDateOnly], [IsSearchable], [AttributeDetail]) 
	VALUES (N'Patient', 2, N'Custom', N'Address', 1, 200, NULL, NULL, 0, 0, 0, NULL)

INSERT [dbo].[CustomAttributeConfiguration] ([ExtendableTypeName], [CustomAttributeType], [Category], [AttributeKey], [IsRequired], [StringMaxLength], [NumericMinValue], [NumericMaxValue], [FutureDateOnly], [PastDateOnly], [IsSearchable], [AttributeDetail]) 
	VALUES (N'Patient', 2, N'Custom', N'Patient Contact Number', 0, 25, NULL, NULL, 0, 0, 0, NULL)

-- *** PATIENT CONDITION
INSERT [dbo].[CustomAttributeConfiguration] ([ExtendableTypeName], [CustomAttributeType], [Category], [AttributeKey], [IsRequired], [StringMaxLength], [NumericMinValue], [NumericMaxValue], [FutureDateOnly], [PastDateOnly], [IsSearchable], [AttributeDetail]) 
	VALUES (N'PatientCondition', 3, N'Custom', N'Condition Ongoing', 0, NULL, NULL, NULL, 0, 0, 0, NULL)
INSERT [dbo].[SelectionDataItem] ([AttributeKey], [SelectionKey], [Value]) 
	VALUES (N'Condition Ongoing', N'0', N'')
INSERT [dbo].[SelectionDataItem] ([AttributeKey], [SelectionKey], [Value]) 
	VALUES (N'Condition Ongoing', N'1', N'Yes')
INSERT [dbo].[SelectionDataItem] ([AttributeKey], [SelectionKey], [Value]) 
	VALUES ( N'Condition Ongoing', N'2', N'No')

-- *** PATIENT LAB TEST
INSERT [dbo].[CustomAttributeConfiguration] ([ExtendableTypeName], [CustomAttributeType], [Category], [AttributeKey], [IsRequired], [StringMaxLength], [NumericMinValue], [NumericMaxValue], [FutureDateOnly], [PastDateOnly], [IsSearchable], [AttributeDetail]) 
	VALUES (N'PatientLabTest', 2, N'Lab Test', N'Comments', 0, 255, NULL, NULL, 0, 0, 0, NULL)

-- *** PATIENT MEDICATION
INSERT [dbo].[CustomAttributeConfiguration] ([ExtendableTypeName], [CustomAttributeType], [Category], [AttributeKey], [IsRequired], [StringMaxLength], [NumericMinValue], [NumericMaxValue], [FutureDateOnly], [PastDateOnly], [IsSearchable], [AttributeDetail]) 
	VALUES (N'PatientMedication', 3, N'Custom', N'Still On Medication', 0, NULL, NULL, NULL, 0, 0, 0, NULL)
INSERT [dbo].[SelectionDataItem] ([AttributeKey], [SelectionKey], [Value]) 
	VALUES (N'Still On Medication', N'0', N'')
INSERT [dbo].[SelectionDataItem] ([AttributeKey], [SelectionKey], [Value]) 
	VALUES (N'Still On Medication', N'1', N'Yes')
INSERT [dbo].[SelectionDataItem] ([AttributeKey], [SelectionKey], [Value]) 
	VALUES (N'Still On Medication', N'2', N'No')

INSERT [dbo].[CustomAttributeConfiguration] ([ExtendableTypeName], [CustomAttributeType], [Category], [AttributeKey], [IsRequired], [StringMaxLength], [NumericMinValue], [NumericMaxValue], [FutureDateOnly], [PastDateOnly], [IsSearchable], [AttributeDetail]) 
	VALUES (N'PatientMedication', 2, N'Custom', N'Indication', 0, 50, NULL, NULL, 0, 0, 0, NULL)

INSERT [dbo].[CustomAttributeConfiguration] ([ExtendableTypeName], [CustomAttributeType], [Category], [AttributeKey], [IsRequired], [StringMaxLength], [NumericMinValue], [NumericMaxValue], [FutureDateOnly], [PastDateOnly], [IsSearchable], [AttributeDetail]) 
	VALUES (N'PatientMedication', 3, N'Custom', N'Type of Indication', 0, NULL, NULL, NULL, 0, 0, 0, NULL)
INSERT [dbo].[SelectionDataItem] ([AttributeKey], [SelectionKey], [Value]) 
	VALUES (N'Type of Indication', N'0', N'')
INSERT [dbo].[SelectionDataItem] ([AttributeKey], [SelectionKey], [Value]) 
	VALUES (N'Type of Indication', N'1', N'Primary')
INSERT [dbo].[SelectionDataItem] ([AttributeKey], [SelectionKey], [Value]) 
	VALUES (N'Type of Indication', N'2', N'Pre-existing condition')
INSERT [dbo].[SelectionDataItem] ([AttributeKey], [SelectionKey], [Value]) 
	VALUES (N'Type of Indication', N'3', N'Treat AE')

INSERT [dbo].[CustomAttributeConfiguration] ([ExtendableTypeName], [CustomAttributeType], [Category], [AttributeKey], [IsRequired], [StringMaxLength], [NumericMinValue], [NumericMaxValue], [FutureDateOnly], [PastDateOnly], [IsSearchable], [AttributeDetail]) 
	VALUES (N'PatientMedication', 3, N'Custom', N'Reason For Stopping', 0, NULL, NULL, NULL, 0, 0, 0, NULL)
INSERT [dbo].[SelectionDataItem] ([AttributeKey], [SelectionKey], [Value]) 
	VALUES (N'Reason For Stopping', N'0', N'')
INSERT [dbo].[SelectionDataItem] ([AttributeKey], [SelectionKey], [Value]) 
	VALUES (N'Reason For Stopping', N'1', N'Adverse Event')
INSERT [dbo].[SelectionDataItem] ([AttributeKey], [SelectionKey], [Value]) 
	VALUES (N'Reason For Stopping', N'2', N'Cost')
INSERT [dbo].[SelectionDataItem] ([AttributeKey], [SelectionKey], [Value]) 
	VALUES (N'Reason For Stopping', N'3', N'Course Completed')
INSERT [dbo].[SelectionDataItem] ([AttributeKey], [SelectionKey], [Value]) 
	VALUES (N'Reason For Stopping', N'4', N'Cured')
INSERT [dbo].[SelectionDataItem] ([AttributeKey], [SelectionKey], [Value]) 
	VALUES (N'Reason For Stopping', N'5', N'Lost To Follow-up')
INSERT [dbo].[SelectionDataItem] ([AttributeKey], [SelectionKey], [Value]) 
	VALUES (N'Reason For Stopping', N'6', N'Medicine Out of Stock')
INSERT [dbo].[SelectionDataItem] ([AttributeKey], [SelectionKey], [Value]) 
	VALUES (N'Reason For Stopping', N'7', N'No Longer Needed')
INSERT [dbo].[SelectionDataItem] ([AttributeKey], [SelectionKey], [Value]) 
	VALUES (N'Reason For Stopping', N'8', N'Patient Died')
INSERT [dbo].[SelectionDataItem] ([AttributeKey], [SelectionKey], [Value]) 
	VALUES (N'Reason For Stopping', N'9', N'Patient Withdrew Consent')
INSERT [dbo].[SelectionDataItem] ([AttributeKey], [SelectionKey], [Value]) 
	VALUES (N'Reason For Stopping', N'10', N'Planned Medication Change')
INSERT [dbo].[SelectionDataItem] ([AttributeKey], [SelectionKey], [Value]) 
	VALUES (N'Reason For Stopping', N'11', N'Poor Adherence')
INSERT [dbo].[SelectionDataItem] ([AttributeKey], [SelectionKey], [Value]) 
	VALUES (N'Reason For Stopping', N'12', N'Pregnancy')
INSERT [dbo].[SelectionDataItem] ([AttributeKey], [SelectionKey], [Value]) 
	VALUES (N'Reason For Stopping', N'13', N'Treatment Failure')
INSERT [dbo].[SelectionDataItem] ([AttributeKey], [SelectionKey], [Value]) 
	VALUES (N'Reason For Stopping', N'14', N'Not Applicable')

INSERT [dbo].[CustomAttributeConfiguration] ([ExtendableTypeName], [CustomAttributeType], [Category], [AttributeKey], [IsRequired], [StringMaxLength], [NumericMinValue], [NumericMaxValue], [FutureDateOnly], [PastDateOnly], [IsSearchable], [AttributeDetail]) 
	VALUES (N'PatientMedication', 3, N'Custom', N'Clinician action taken with regard to medicine if related to AE', 0, NULL, NULL, NULL, 0, 0, 0, NULL)
INSERT [dbo].[SelectionDataItem] ([AttributeKey], [SelectionKey], [Value]) 
	VALUES (N'Clinician action taken with regard to medicine if related to AE', N'0', N'')
INSERT [dbo].[SelectionDataItem] ([AttributeKey], [SelectionKey], [Value]) 
	VALUES (N'Clinician action taken with regard to medicine if related to AE', N'1', N'Dose not changed')
INSERT [dbo].[SelectionDataItem] ([AttributeKey], [SelectionKey], [Value]) 
	VALUES (N'Clinician action taken with regard to medicine if related to AE', N'2', N'Dose reduced')
INSERT [dbo].[SelectionDataItem] ([AttributeKey], [SelectionKey], [Value]) 
	VALUES (N'Clinician action taken with regard to medicine if related to AE', N'3', N'Drug interrupted')
INSERT [dbo].[SelectionDataItem] ([AttributeKey], [SelectionKey], [Value]) 
	VALUES (N'Clinician action taken with regard to medicine if related to AE', N'4', N'Drug withdrawn')
INSERT [dbo].[SelectionDataItem] ([AttributeKey], [SelectionKey], [Value]) 
	VALUES (N'Clinician action taken with regard to medicine if related to AE', N'5', N'Not applicable')

INSERT [dbo].[CustomAttributeConfiguration] ([ExtendableTypeName], [CustomAttributeType], [Category], [AttributeKey], [IsRequired], [StringMaxLength], [NumericMinValue], [NumericMaxValue], [FutureDateOnly], [PastDateOnly], [IsSearchable], [AttributeDetail]) 
	VALUES (N'PatientMedication', 2, N'Custom', N'Batch Number', 0, 50, NULL, NULL, 0, 0, 0, NULL)

INSERT [dbo].[CustomAttributeConfiguration] ([ExtendableTypeName], [CustomAttributeType], [Category], [AttributeKey], [IsRequired], [StringMaxLength], [NumericMinValue], [NumericMaxValue], [FutureDateOnly], [PastDateOnly], [IsSearchable], [AttributeDetail]) 
	VALUES (N'PatientMedication', 3, N'Custom', N'Effect OF Dechallenge (D) & Rechallenge (R)', 0, NULL, NULL, NULL, 0, 0, 0, NULL)
INSERT [dbo].[SelectionDataItem] ([AttributeKey], [SelectionKey], [Value]) 
	VALUES (N'Effect OF Dechallenge (D) & Rechallenge (R)', N'0', N'')
INSERT [dbo].[SelectionDataItem] ([AttributeKey], [SelectionKey], [Value]) 
	VALUES (N'Effect OF Dechallenge (D) & Rechallenge (R)', N'1', N'Not Applicable')
INSERT [dbo].[SelectionDataItem] ([AttributeKey], [SelectionKey], [Value]) 
	VALUES (N'Effect OF Dechallenge (D) & Rechallenge (R)', N'2', N'D - AE improved/ resolved when medicine dose reduced/interrupted /withdrawn')
INSERT [dbo].[SelectionDataItem] ([AttributeKey], [SelectionKey], [Value]) 
	VALUES (N'Effect OF Dechallenge (D) & Rechallenge (R)', N'3', N'D - AE did not improve/ resolve when medicine dose reduced/interrupted /withdrawn')
INSERT [dbo].[SelectionDataItem] ([AttributeKey], [SelectionKey], [Value]) 
	VALUES (N'Effect OF Dechallenge (D) & Rechallenge (R)', N'4', N'D - Unknown')
INSERT [dbo].[SelectionDataItem] ([AttributeKey], [SelectionKey], [Value]) 
	VALUES (N'Effect OF Dechallenge (D) & Rechallenge (R)', N'5', N'R - patient not re-exposed to the medicine')
INSERT [dbo].[SelectionDataItem] ([AttributeKey], [SelectionKey], [Value]) 
	VALUES (N'Effect OF Dechallenge (D) & Rechallenge (R)', N'6', N'R - AE recurred on medicine re-administration/dose increase')
INSERT [dbo].[SelectionDataItem] ([AttributeKey], [SelectionKey], [Value]) 
	VALUES (N'Effect OF Dechallenge (D) & Rechallenge (R)', N'7', N'R - AE did not recur on medicine re-administration/dose increase')
INSERT [dbo].[SelectionDataItem] ([AttributeKey], [SelectionKey], [Value]) 
	VALUES (N'Effect OF Dechallenge (D) & Rechallenge (R)', N'8', N'R - Unknown')

INSERT [dbo].[CustomAttributeConfiguration] ([ExtendableTypeName], [CustomAttributeType], [Category], [AttributeKey], [IsRequired], [StringMaxLength], [NumericMinValue], [NumericMaxValue], [FutureDateOnly], [PastDateOnly], [IsSearchable], [AttributeDetail]) 
	VALUES (N'PatientMedication', 2, N'Custom', N'Comments', 0, 100, NULL, NULL, 0, 0, 0, NULL)

-- *** PATIENT CLINICAL EVENT
INSERT [dbo].[CustomAttributeConfiguration] ([ExtendableTypeName], [CustomAttributeType], [Category], [AttributeKey], [IsRequired], [StringMaxLength], [NumericMinValue], [NumericMaxValue], [FutureDateOnly], [PastDateOnly], [IsSearchable], [AttributeDetail]) 
	VALUES (N'PatientClinicalEvent', 2, N'Custom', N'SAE Number', 0, 50, NULL, NULL, 0, 0, 0, NULL)

INSERT [dbo].[CustomAttributeConfiguration] ([ExtendableTypeName], [CustomAttributeType], [Category], [AttributeKey], [IsRequired], [StringMaxLength], [NumericMinValue], [NumericMaxValue], [FutureDateOnly], [PastDateOnly], [IsSearchable], [AttributeDetail]) 
	VALUES (N'PatientClinicalEvent', 3, N'Custom', N'Outcome', 0, NULL, NULL, NULL, 0, 0, 0, N'For fatal outcomes, please ensure all conditions are updated to reflect the relevant condition outcome')
INSERT [dbo].[SelectionDataItem] ([AttributeKey], [SelectionKey], [Value]) 
	VALUES (N'Outcome', N'0', N'')
INSERT [dbo].[SelectionDataItem] ([AttributeKey], [SelectionKey], [Value]) 
	VALUES (N'Outcome', N'1', N'Resolved')
INSERT [dbo].[SelectionDataItem] ([AttributeKey], [SelectionKey], [Value]) 
	VALUES (N'Outcome', N'2', N'Resolved with sequelae')
INSERT [dbo].[SelectionDataItem] ([AttributeKey], [SelectionKey], [Value]) 
	VALUES (N'Outcome', N'3', N'Fatal')
INSERT [dbo].[SelectionDataItem] ([AttributeKey], [SelectionKey], [Value]) 
	VALUES (N'Outcome', N'4', N'Resolving')
INSERT [dbo].[SelectionDataItem] ([AttributeKey], [SelectionKey], [Value]) 
	VALUES (N'Outcome', N'5', N'Not resolved')
INSERT [dbo].[SelectionDataItem] ([AttributeKey], [SelectionKey], [Value]) 
	VALUES (N'Outcome', N'6', N'Unknown')

INSERT [dbo].[CustomAttributeConfiguration] ([ExtendableTypeName], [CustomAttributeType], [Category], [AttributeKey], [IsRequired], [StringMaxLength], [NumericMinValue], [NumericMaxValue], [FutureDateOnly], [PastDateOnly], [IsSearchable], [AttributeDetail]) 
	VALUES (N'PatientClinicalEvent', 3, N'Custom', N'Intensity (Severity)', 0, NULL, NULL, NULL, 0, 0, 0, NULL)
INSERT [dbo].[SelectionDataItem] ([AttributeKey], [SelectionKey], [Value]) 
	VALUES (N'Intensity (Severity)', N'0', N'')
INSERT [dbo].[SelectionDataItem] ([AttributeKey], [SelectionKey], [Value]) 
	VALUES (N'Intensity (Severity)', N'1', N'Mild')
INSERT [dbo].[SelectionDataItem] ([AttributeKey], [SelectionKey], [Value]) 
	VALUES (N'Intensity (Severity)', N'2', N'Moderate')
INSERT [dbo].[SelectionDataItem] ([AttributeKey], [SelectionKey], [Value]) 
	VALUES (N'Intensity (Severity)', N'3', N'Severe')

INSERT [dbo].[CustomAttributeConfiguration] ([ExtendableTypeName], [CustomAttributeType], [Category], [AttributeKey], [IsRequired], [StringMaxLength], [NumericMinValue], [NumericMaxValue], [FutureDateOnly], [PastDateOnly], [IsSearchable], [AttributeDetail]) 
	VALUES (N'PatientClinicalEvent', 3, N'Custom', N'Severity Grading Scale', 0, NULL, NULL, NULL, 0, 0, 0, NULL)
INSERT [dbo].[SelectionDataItem] ([AttributeKey], [SelectionKey], [Value]) 
	VALUES (N'Severity Grading Scale', N'0', N'')
INSERT [dbo].[SelectionDataItem] ([AttributeKey], [SelectionKey], [Value]) 
	VALUES (N'Severity Grading Scale', N'1', N'WHO Scale')
INSERT [dbo].[SelectionDataItem] ([AttributeKey], [SelectionKey], [Value]) 
	VALUES (N'Severity Grading Scale', N'2', N'Clinician�s judgement')
INSERT [dbo].[SelectionDataItem] ([AttributeKey], [SelectionKey], [Value]) 
	VALUES (N'Severity Grading Scale', N'3', N'CTCAE grading system')
INSERT [dbo].[SelectionDataItem] ([AttributeKey], [SelectionKey], [Value]) 
	VALUES (N'Severity Grading Scale', N'4', N'DAIDS AE Grading Table')
INSERT [dbo].[SelectionDataItem] ([AttributeKey], [SelectionKey], [Value]) 
	VALUES (N'Severity Grading Scale', N'5', N'Other')

INSERT [dbo].[CustomAttributeConfiguration] ([ExtendableTypeName], [CustomAttributeType], [Category], [AttributeKey], [IsRequired], [StringMaxLength], [NumericMinValue], [NumericMaxValue], [FutureDateOnly], [PastDateOnly], [IsSearchable], [AttributeDetail]) 
	VALUES (N'PatientClinicalEvent', 3, N'Custom', N'Severity Grade', 0, NULL, NULL, NULL, 0, 0, 0, NULL)
INSERT [dbo].[SelectionDataItem] ([AttributeKey], [SelectionKey], [Value]) 
	VALUES (N'Severity Grade', N'0', N'')
INSERT [dbo].[SelectionDataItem] ([AttributeKey], [SelectionKey], [Value]) 
	VALUES (N'Severity Grade', N'1', N'Grade 1')
INSERT [dbo].[SelectionDataItem] ([AttributeKey], [SelectionKey], [Value]) 
	VALUES (N'Severity Grade', N'2', N'Grade 2')
INSERT [dbo].[SelectionDataItem] ([AttributeKey], [SelectionKey], [Value]) 
	VALUES (N'Severity Grade', N'3', N'Grade 3')
INSERT [dbo].[SelectionDataItem] ([AttributeKey], [SelectionKey], [Value]) 
	VALUES (N'Severity Grade', N'4', N'Grade 4')
INSERT [dbo].[SelectionDataItem] ([AttributeKey], [SelectionKey], [Value]) 
	VALUES (N'Severity Grade', N'5', N'Grade 5')

INSERT [dbo].[CustomAttributeConfiguration] ([ExtendableTypeName], [CustomAttributeType], [Category], [AttributeKey], [IsRequired], [StringMaxLength], [NumericMinValue], [NumericMaxValue], [FutureDateOnly], [PastDateOnly], [IsSearchable], [AttributeDetail]) 
	VALUES (N'PatientClinicalEvent', 3, N'Custom', N'Is the adverse event serious?', 0, NULL, NULL, NULL, 0, 0, 0, NULL)
INSERT [dbo].[SelectionDataItem] ([AttributeKey], [SelectionKey], [Value]) 
	VALUES (N'Is the adverse event serious?', N'0', N'')
INSERT [dbo].[SelectionDataItem] ([AttributeKey], [SelectionKey], [Value]) 
	VALUES (N'Is the adverse event serious?', N'1', N'Yes')
INSERT [dbo].[SelectionDataItem] ([AttributeKey], [SelectionKey], [Value]) 
	VALUES (N'Is the adverse event serious?', N'2', N'No')
INSERT [dbo].[SelectionDataItem] ([AttributeKey], [SelectionKey], [Value]) 
	VALUES (N'Is the adverse event serious?', N'3', N'Unknown')

INSERT [dbo].[CustomAttributeConfiguration] ([ExtendableTypeName], [CustomAttributeType], [Category], [AttributeKey], [IsRequired], [StringMaxLength], [NumericMinValue], [NumericMaxValue], [FutureDateOnly], [PastDateOnly], [IsSearchable], [AttributeDetail]) 
	VALUES (N'PatientClinicalEvent', 3, N'Custom', N'Seriousness', 0, NULL, NULL, NULL, 0, 0, 0, NULL)
INSERT [dbo].[SelectionDataItem] ([AttributeKey], [SelectionKey], [Value]) 
	VALUES (N'Seriousness', N'0', N'')
INSERT [dbo].[SelectionDataItem] ([AttributeKey], [SelectionKey], [Value]) 
	VALUES (N'Seriousness', N'1', N'A congenital anomaly or birth defect')
INSERT [dbo].[SelectionDataItem] ([AttributeKey], [SelectionKey], [Value]) 
	VALUES (N'Seriousness', N'2', N'Persistent or significant disability or incapacity')
INSERT [dbo].[SelectionDataItem] ([AttributeKey], [SelectionKey], [Value]) 
	VALUES (N'Seriousness', N'3', N'Death')
INSERT [dbo].[SelectionDataItem] ([AttributeKey], [SelectionKey], [Value]) 
	VALUES (N'Seriousness', N'4', N'Hospitalisation')
INSERT [dbo].[SelectionDataItem] ([AttributeKey], [SelectionKey], [Value]) 
	VALUES (N'Seriousness', N'5', N'Prolonged hospitalisation')
INSERT [dbo].[SelectionDataItem] ([AttributeKey], [SelectionKey], [Value]) 
	VALUES (N'Seriousness', N'6', N'Life threatening')
INSERT [dbo].[SelectionDataItem] ([AttributeKey], [SelectionKey], [Value]) 
	VALUES (N'Seriousness', N'7', N'A medically important event')

INSERT [dbo].[CustomAttributeConfiguration] ([ExtendableTypeName], [CustomAttributeType], [Category], [AttributeKey], [IsRequired], [StringMaxLength], [NumericMinValue], [NumericMaxValue], [FutureDateOnly], [PastDateOnly], [IsSearchable], [AttributeDetail]) 
	VALUES (N'PatientClinicalEvent', 2, N'Custom', N'Comments', 0, 100, NULL, NULL, 0, 0, 0, NULL)
