using Payroll.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Payroll.Data.Persistence
{
    public class Seed
    {
        public static void SeedData(PayrollContext context)
        {
            if(!context.Jobsites.Any()) //if no data in database...seed
            {
                var jobsites = new List<Jobsite>
                {
                    new Jobsite
                    {
                        Name = "Bombay Darbar",
                        Moniker = "I4500",
                        Location = new Location
                        {
                            Address1 = "1521 E Las Olas Blvd",
                            CityTown = "Fort Lauderdale",
                            StateProvince = "Florida",
                            PostalCode = "33301",
                            Country = "USA"                            
                        }
                    },
                    new Jobsite
                    {
                        Name = "The Whole Enchilada",
                        Moniker = "I4521",
                        Location = new Location
                        {
                            Address1 = "745 N Federal Hwy",
                            CityTown = "Fort Lauderdale",
                            StateProvince = "Florida",
                            PostalCode = "33304",
                            Country = "USA"
                        }
                    },
                    new Jobsite
                    {
                        Name = "Pizza Time",
                        Moniker = "I4536",
                        Location = new Location
                        {
                            Address1 = "11504 W Sample Rd",
                            CityTown = "Coral Springs",
                            StateProvince = "Florida",
                            PostalCode = "33065",
                            Country = "USA"
                        }
                    },
                    new Jobsite
                    {
                        Name = "Casa Maya",
                        Moniker = "I4544",
                        Location = new Location
                        {
                            Address1 = "301 SE 15th Terrace",
                            CityTown = "Deerfield Beach",
                            StateProvince = "Florida",
                            PostalCode = "33441",
                            Country = "USA"
                        }
                    },

                };

                context.Jobsites.AddRange(jobsites);
                context.SaveChanges();
            }
        }
    }
}
