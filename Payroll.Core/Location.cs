using System.ComponentModel.DataAnnotations;

namespace Payroll.Core
{
    public class Location
    {
        [Required]
        [MaxLength(50)]
        public string Address1 { get; set; }
        public string Address2 { get; set; }
        public string Address3 { get; set; }
        [Required]
        [MaxLength(20)]
        public string CityTown { get; set; }
        [Required]
        [MaxLength(20)]
        public string StateProvince { get; set; }
        [Required]
        [MaxLength(10)]
        public string PostalCode { get; set; }
        [Required]
        [MaxLength(30)]
        public string Country { get; set; }
    }
}