using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Weathering_with_You_.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel;
    using System.ComponentModel.DataAnnotations;
    using System.Web.Mvc;

    [Bind(Exclude = "Registration")]
    public class UserSignUp
    {
        public int userID { get; set; }


        [DisplayName("First Name")]
        [Required(AllowEmptyStrings = false, ErrorMessage = "Give your First Name")]
        [RegularExpression(pattern: "^[a-zA-Z][a-zA-Z\\s]+$", ErrorMessage = "Using only Alfabet")]
        public string firstName { get; set; }



        [DisplayName("Last Name")]
        [Required(AllowEmptyStrings = false, ErrorMessage = "Give your Last Name")]
        [RegularExpression(pattern: "^[a-zA-Z][a-zA-Z\\s]+$", ErrorMessage = "Using only Alfabet")]
        public string lastName { get; set; }


        [DisplayName("City Name")]
        [Required(AllowEmptyStrings = false, ErrorMessage = "Give your City Name")]
        [RegularExpression(pattern: "^[a-zA-Z][a-zA-Z\\s]+$", ErrorMessage = "Using only Alfabet")]

        public string city { get; set; }


        [DisplayName("Address")]
        [Required(AllowEmptyStrings = false, ErrorMessage = "Give your Address")]
        [RegularExpression(pattern: "^[a-zA-Z][a-zA-Z\\s]+$", ErrorMessage = "Using only Alfabet")]
        public string address { get; set; }


        [DisplayName("User Name")]
        [Required(AllowEmptyStrings = false, ErrorMessage = "Give your User Name")]
        [RegularExpression(pattern: "^(?=.{5,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$", ErrorMessage = "Using only Alfanumeric")]
        public string userName { get; set; }


        [DisplayName("Password")]
        [DataType(DataType.Password)]
        [Required(AllowEmptyStrings = false, ErrorMessage = "Give your Password")]
        [RegularExpression(pattern: "(?=.*\\d)(?=.*[A-Za-z]).{5,}", ErrorMessage = "Using only Alfanumeric")]
        public string password { get; set; }


        [DisplayName("Email")]
        [Required(AllowEmptyStrings = false, ErrorMessage = "Give your Email")]
        [DataType(DataType.EmailAddress, ErrorMessage = "E-mail is not valid")]
        public string email { get; set; }
    }
}