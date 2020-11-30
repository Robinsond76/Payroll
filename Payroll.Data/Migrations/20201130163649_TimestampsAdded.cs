using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Payroll.Data.Migrations
{
    public partial class TimestampsAdded : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Timestamps",
                columns: table => new
                {
                    AppUserId = table.Column<string>(nullable: false),
                    JobsiteId = table.Column<int>(nullable: false),
                    ClockedIn = table.Column<bool>(nullable: false),
                    ClockedInStamp = table.Column<DateTime>(nullable: false),
                    LunchStamp = table.Column<DateTime>(nullable: false),
                    ClockedOutStamp = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Timestamps", x => new { x.AppUserId, x.JobsiteId });
                    table.ForeignKey(
                        name: "FK_Timestamps_AspNetUsers_AppUserId",
                        column: x => x.AppUserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Timestamps_Jobsites_JobsiteId",
                        column: x => x.JobsiteId,
                        principalTable: "Jobsites",
                        principalColumn: "JobsiteId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Timestamps_JobsiteId",
                table: "Timestamps",
                column: "JobsiteId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Timestamps");
        }
    }
}
