using Payroll.Core;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Payroll.Data.Models
{
    public class JobsiteDto
    {
        [Required(ErrorMessage = "A name for the jobsite is required.")]
        [MaxLength(50)]
        public string Name { get; set; }

        [Required(ErrorMessage = "Please provide a Moniker for the jobsite, ie: I4000.")]
        [MaxLength(6)]
        public string Moniker { get; set; }

        [Required(ErrorMessage = "Please provide an address.")]
        [MaxLength(50)]
        public string Address1 { get; set; }
        public string Address2 { get; set; }
        public string Address3 { get; set; }

        [Required(ErrorMessage = "Please provide the city.")]
        [MaxLength(20)]
        public string CityTown { get; set; }

        [Required(ErrorMessage = "Please provide the state.")]
        [MaxLength(20)]
        public string StateProvince { get; set; }

        [Required(ErrorMessage = "Please provide the postal code.")]
        [MaxLength(10)]
        public string PostalCode { get; set; }

        [Required(ErrorMessage = "Please provide the country.")]
        [MaxLength(30)]
        public string Country { get; set; }
    }
}
