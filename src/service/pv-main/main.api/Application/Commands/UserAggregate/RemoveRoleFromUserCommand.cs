﻿using MediatR;
using System.Runtime.Serialization;

namespace OpenRIMS.PV.Main.API.Application.Commands.UserAggregate
{
    [DataContract]
    public class RemoveRoleFromUserCommand
        : IRequest<bool>
    {
        [DataMember]
        public int UserId { get; private set; }

        [DataMember]
        public string Role { get; set; }

        public RemoveRoleFromUserCommand()
        {
        }

        public RemoveRoleFromUserCommand(int userId, string role) : this()
        {
            UserId = userId;
            Role = role;
        }
    }
}
