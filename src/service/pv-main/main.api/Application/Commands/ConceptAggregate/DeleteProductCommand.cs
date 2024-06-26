﻿using MediatR;
using System.Runtime.Serialization;

namespace OpenRIMS.PV.Main.API.Application.Commands.ConceptAggregate
{
    [DataContract]
    public class DeleteProductCommand
        : IRequest<bool>
    {
        [DataMember]
        public int ProductId { get; private set; }

        public DeleteProductCommand()
        {
        }

        public DeleteProductCommand(int productId): this()
        {
            ProductId = productId;
        }
    }
}
