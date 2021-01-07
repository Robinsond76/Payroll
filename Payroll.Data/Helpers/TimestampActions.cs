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

        public static ICollection<UserWorkHistoryDto> GetUserWorkHistory(ICollection<Timestamp> timestamps)
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
                            JobsitesClocked = new List<JobsiteWorkHistoryDto>()
                        }
                    );
                }

                //tally up the user's total work hours
                var span = timestamp.ClockedOutStamp - timestamp.ClockedInStamp;
                userWorkHistory[timestamp.AppUser.UserName].HoursWorked = span.TotalHours;
            }

            //Create and add the JobsiteWorkHistoryDtos to each user
            foreach(var user in userWorkHistory)
            {
                //for each user,
                //create a dictionary for jobsites and it's work history
                var userJobsiteHistory = new Dictionary<string, JobsiteWorkHistoryDto>();

                
                foreach (var timestamp in timestamps)
                {
                    //confirm timestamp belongs to current user iteration
                    if (timestamp.AppUser.UserName == user.Key)
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
                }

                //add the list of jobsite work history to the current user iteration
                userWorkHistory[user.Key].JobsitesClocked = userJobsiteHistory.Values.ToList();
            }

            return userWorkHistory.Values.ToList(); 
        }

        public static ICollection<string> GetEmployeesFromJobsite(ICollection<Timestamp> timestamps)
        {
            ICollection<string> employees = new List<string>();

            foreach (var timestamp in timestamps)
            {
                if (employees.Contains(timestamp.AppUser.DisplayName))
                    continue;
                //else
                employees.Add(timestamp.AppUser.DisplayName);
            }

            return employees;
        }
    }
}
