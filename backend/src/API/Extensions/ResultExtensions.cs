using Application.Common.Result;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;

namespace API.Extensions;

public static class ResultExtensions
{
    public static ObjectResult ToProblemDetails(this Result result, HttpContext httpContext)
    {
        var factory = httpContext.RequestServices.GetRequiredService<ProblemDetailsFactory>();

        var problemDetails = factory.CreateProblemDetails(
            httpContext,
            statusCode: result.Error.HttpStatusCode,
            title: result.Error.Title,
            detail: result.Error.Description
        );


        return new ObjectResult(problemDetails)
        {
            StatusCode = problemDetails.Status
        };
    }
}
