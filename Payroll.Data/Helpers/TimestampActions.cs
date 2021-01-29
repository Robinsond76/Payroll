using Payroll.Core;
using Payroll.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Payroll.Data.Helpers
{
    public class TimestampActions
    {
        public static int UniqueEmployeeCount(ICollection<Timestamp> timestamps)
        {
            var Employees = new List<string>();
            foreach(Timestamp timestamp in timestamps)
            {
                if (Employees.Contains(timestamp.AppUserId))
                    continue;
                //else
                Employees.Add(timestamp.AppUserId);                
            }
            return Employees.Count;
        }
        
        public static int UniqueJobsiteCount(ICollection<Timestamp> timestamps)
        {
            var jobsites = new List<int>();
            foreach(Timestamp timestamp in timestamps)
            {
                if (jobsites.Contains(timestamp.JobsiteId))
                    continue;
                //else
                jobsites.Add(timestamp.JobsiteId);                
            }
            return jobsites.Count;
        }

        public static ICollection<string> ClockedInEmployees(ICollection<Timestamp> timestamps)
        {
            var employees = new List<string>();
            foreach(Timestamp timestamp in timestamps)
            {
                if (!employees.Contains(timestamp.AppUser.DisplayName))
                    employees.Add(timestamp.AppUser.DisplayName);
                //else
                continue;
            }
            return employees;
        }

        public static ICollection<object> ClockedInJobsites(ICollection<Timestamp> timestamps)
        {
            var jobsites = new Dictionary<string, object>();
            foreach (Timestamp timestamp in timestamps)
            {
                if (!jobsites.ContainsKey(timestamp.Jobsite.Moniker))
                    jobsites.Add(timestamp.Jobsite.Moniker, new 
                    {
                        moniker = timestamp.Jobsite.Moniker,
                        name = timestamp.Jobsite.Name
                    });
                //else
                continue;
            }
            return jobsites.Values.ToList();
        }

        public static ICollection<UserWorkHistoryDto> GetWorkHistory(ICollection<Timestamp> timestamps)
        {
            Dictionary<string, UserWorkHistoryDto> userWorkHistory = new Dictionary<string, UserWorkHistoryDto>();

            foreach (Timestamp timestamp in timestamps)
            {
                //Create a userWorkHistory entry if doesn't exist
                if (!userWorkHistory.ContainsKey(timestamp.AppUser.UserName))
                {
                    userWorkHistory.Add(timestamp.AppUser.UserName,
                        new UserWorkHistoryDto
                        {
                            DisplayName = timestamp.AppUser.DisplayName,
                            Username = timestamp.AppUser.UserName,
                        }
                    );
                }

                //tally up the user's total work hours
                var span = timestamp.ClockedOutStamp - timestamp.ClockedInStamp;
                userWorkHistory[timestamp.AppUser.UserName].HoursWorked = span.TotalHours;
            }

            return userWorkHistory.Values.ToList();
        }

        public static ICollection<JobsiteWorkHistoryDto> GetUserWorkHistory(ICollection<Timestamp> timestamps)
        {
            var userJobsiteHistory = new Dictionary<string, JobsiteWorkHistoryDto>();

            foreach (Timestamp timestamp in timestamps)
            {
                if (!userJobsiteHistory.ContainsKey(timestamp.Jobsite.Moniker))
                {
                    userJobsiteHistory.Add(timestamp.Jobsite.Moniker,
                        new JobsiteWorkHistoryDto
                        {
                            Name = timestamp.Jobsite.Name,
                            Moniker = timestamp.Jobsite.Moniker
                        }
                    );
                }

                var span = timestamp.ClockedOutStamp - timestamp.ClockedInStamp;
                userJobsiteHistory[timestamp.Jobsite.Moniker].HoursWorkedDouble = span.TotalHours;
            }

            return userJobsiteHistory.Values.ToList();
        }

        public static ICollection<UserGeneralInfoDto> GetEmployeesFromJobsite(ICollection<Timestamp> timestamps)
        {
            var employees = new Dictionary<string, UserGeneralInfoDto>();

            foreach (var timestamp in timestamps)
            {
                if (employees.ContainsKey(timestamp.AppUser.UserName))
                    continue;
                //else
                employees.Add(timestamp.AppUser.UserName, new UserGeneralInfoDto 
                {
                    DisplayName = timestamp.AppUser.DisplayName,
                    Username = timestamp.AppUser.UserName,
                    Email = timestamp.AppUser.Email
                });
            }

            return employees.Values.ToList();
        }

        public static ICollection<JobsiteBasicDto> GetJobsitesFromTimestamps(ICollection<Timestamp> timestamps)
        {
            var jobsites = new Dictionary<string, JobsiteBasicDto>();

            foreach (var timestamp in timestamps)
            {
                if (jobsites.ContainsKey(timestamp.Jobsite.Moniker))
                    continue;
                //else
                jobsites.Add(timestamp.Jobsite.Moniker, new JobsiteBasicDto
                {
                    Name = timestamp.Jobsite.Name,
                    Moniker = timestamp.Jobsite.Moniker
                });
            }

            return jobsites.Values.ToList();
        }



        //public static ICollection<object> GetAllJobsitesVisitedByEmployee(ICollection<Timestamp> timestamps)
        //{
        //    Dictionary<string, object> jobsitesVisted = new Dictionary<string, object>();

        //    foreach (Timestamp timestamp in timestamps)
        //    {
        //        if (jobsitesVisted.ContainsKey(timestamp.Jobsite.Moniker))
        //            continue;
        //        //else
        //        jobsitesVisted.Add(timestamp.Jobsite.Moniker, new
        //        {
        //            timestamp.Jobsite.Moniker,
        //            timestamp.Jobsite.Name
        //        });
        //    }

        //    return jobsitesVisted.Values.ToList();
        //}
    }
}
