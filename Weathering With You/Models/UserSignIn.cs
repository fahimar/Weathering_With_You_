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

    [Bind(Exclude = "Login")]
    public class UserSignIn
    {

        [DisplayName("User Name")]
        [Required(AllowEmptyStrings = false, ErrorMessage = "Give your User Name")]
        public string userName { get; set; }
        [DisplayName("Password")]
        [DataType(DataType.Password)]
        [Required(AllowEmptyStrings = false, ErrorMessage = "Give your Password")]
        public string password { get; set; }
    }
}
