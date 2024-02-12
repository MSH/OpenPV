﻿using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using OpenRIMS.PV.Main.API.Infrastructure.Settings;
using OpenRIMS.PV.Main.Infrastructure.Identity;
using System;
using System.IO;

namespace OpenRIMS.PV.Main.API.Infrastructure.Factories
{
    public class IdentityDbContextFactory : IDesignTimeDbContextFactory<IdentityDbContext>
    {
        public IdentityDbContext CreateDbContext(string[] args)
        {
            var config = new ConfigurationBuilder()
               .SetBasePath(Path.Combine(Directory.GetCurrentDirectory()))
               .AddJsonFile("appsettings.json")
               .AddEnvironmentVariables()
               .Build();

            var providerSettings = config.GetSection(nameof(DatabaseProviderSettings));

            var serverVersion = new MySqlServerVersion(new Version(5, 7, 29));

            var optionsBuilder = new DbContextOptionsBuilder<IdentityDbContext>();

            if (providerSettings.GetValue<string>(key: "Type") == "MySQL")
            {
                optionsBuilder.UseMySql(
                    providerSettings.GetValue<string>(key: "ConnectionString"),
                    serverVersion,
                    mySqlOptions =>
                    {
                        mySqlOptions.MigrationsAssembly("OpenRIMS.PV.Main.Infrastructure.MySQL");
                    });
            }

            if (providerSettings.GetValue<string>(key: "Type") == "SQL")
            {
                optionsBuilder.UseSqlServer(
                    providerSettings.GetValue<string>(key: "ConnectionString"),
                    sqlServerOptionsAction: o => o.MigrationsAssembly("OpenRIMS.PV.Main.Infrastructure.SQL"));
            }

            return new IdentityDbContext(optionsBuilder.Options);
        }
    }
}
