using System;
using System.Net;

namespace Payroll.Data.Errors
{
    public class RestError
    {
        public HttpStatusCode Code { get; }
        public object Errors { get; }

        public RestError(HttpStatusCode code, object errors = null)
        {
            Code = code;
            Errors = errors;
        }

    }
}
