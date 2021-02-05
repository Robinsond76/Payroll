using AutoMapper;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Payroll.Core;
using Payroll.Data.Interfaces;
using Payroll.Data.Models;
using Payroll.Data.Persistence;
using Payroll.Data.Profiles;
using Payroll.Data.Services;
using System;
using System.Text;

namespace API
{
    public class Startup
    {
        private readonly IConfiguration _config;

        public Startup(IConfiguration config)
        {
            _config = config;
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            //All routes require authentication
            services.AddControllers(opt => 
            {
                var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
                opt.Filters.Add(new AuthorizeFilter(policy));
            })
                //fluent Validation
                .AddFluentValidation(cfg => 
                {
                    cfg.RegisterValidatorsFromAssemblyContaining<UserRegisterDto>();
                    cfg.RegisterValidatorsFromAssemblyContaining<UpdatePasswordDto>();
                });

            services.AddDbContext<PayrollContext>();
            services.AddScoped<IJobsiteRepository, JobsiteRepository>();
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<ITimestampRepository, TimestampRepository>();
            services.AddAutoMapper(typeof(MappingProfile));
            services.AddScoped<IJwtGenerator, JwtGenerator>();
            services.AddScoped<IUserAccessor, UserAccessor>();

            //Cors
            services.AddCors(opt =>
            {
                opt.AddPolicy("CorsPolicy", policy =>
                {
                    policy.AllowAnyHeader().AllowAnyMethod()
                    .WithOrigins("http://localhost:3000")
                    .WithExposedHeaders("X-Pagination")
                    .WithExposedHeaders("WWW-Authenticate");
                });
            });

            //Identity
            var builder = services.AddIdentityCore<AppUser>();
            var identityBuilder = new IdentityBuilder(builder.UserType, builder.Services);
            identityBuilder.AddEntityFrameworkStores<PayrollContext>();
            identityBuilder.AddSignInManager<SignInManager<AppUser>>();

            //Jwt Authentication
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["TokenKey"]));
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(opt =>
                {
                    opt.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = key,
                        ValidateAudience = false,
                        ValidateIssuer = false,
                        ValidateLifetime = true,
                        ClockSkew = TimeSpan.Zero
                    };
                });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseHsts();
            }

            //for security headers
            app.UseXContentTypeOptions(); //used to prevent content sniffing
            app.UseReferrerPolicy(opt => opt.NoReferrer()); //restrict info passed to other websites
            app.UseXXssProtection(opt => opt.EnabledWithBlockMode()); //stops page loading when cross-site scripting is discovered
            app.UseXfo(opt => opt.Deny()); //blocks iframes and click jacking
            app.UseCsp(opt => opt
                    .BlockAllMixedContent() //prevents loading assets using http
                    .StyleSources(s => s.Self().CustomSources("https://fonts.googleapis.com/"))
                    .FontSources(s => s.Self().CustomSources("https://fonts.gstatic.com/", "data:"))
                    .FormActions(s => s.Self())
                    .FrameAncestors(s => s.Self())
                    .ImageSources(s => s.Self().CustomSources("data:"))
                    .ScriptSources(s => s.Self().CustomSources("sha256-ma5XxS1EBgt17N22Qq31rOxxRWRfzUTQS1KOtfYwuNo="))
                );

            //app.UseHttpsRedirection();

            app.UseDefaultFiles();
            app.UseStaticFiles();

            app.UseRouting();
            app.UseCors("CorsPolicy");
            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapFallbackToController("Index", "Fallback");
            });
        }
    }
}
