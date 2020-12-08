using Payroll.Core;
using System;
using System.Collections.Generic;
using System.Text;

namespace Payroll.Data.ActionHelpers
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
    }
}
