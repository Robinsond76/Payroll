using Microsoft.EntityFrameworkCore.Migrations;

namespace Payroll.Data.Migrations
{
    public partial class TimestampWithIds : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Timestamps_AspNetUsers_AppUserId",
                table: "Timestamps");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Timestamps",
                table: "Timestamps");

            migrationBuilder.AlterColumn<string>(
                name: "AppUserId",
                table: "Timestamps",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AddColumn<int>(
                name: "TimestampId",
                table: "Timestamps",
                nullable: false,
                defaultValue: 0)
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Timestamps",
                table: "Timestamps",
                column: "TimestampId");

            migrationBuilder.CreateIndex(
                name: "IX_Timestamps_AppUserId",
                table: "Timestamps",
                column: "AppUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Timestamps_AspNetUsers_AppUserId",
                table: "Timestamps",
                column: "AppUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Timestamps_AspNetUsers_AppUserId",
                table: "Timestamps");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Timestamps",
                table: "Timestamps");

            migrationBuilder.DropIndex(
                name: "IX_Timestamps_AppUserId",
                table: "Timestamps");

            migrationBuilder.DropColumn(
                name: "TimestampId",
                table: "Timestamps");

            migrationBuilder.AlterColumn<string>(
                name: "AppUserId",
                table: "Timestamps",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Timestamps",
                table: "Timestamps",
                columns: new[] { "AppUserId", "JobsiteId" });

            migrationBuilder.AddForeignKey(
                name: "FK_Timestamps_AspNetUsers_AppUserId",
                table: "Timestamps",
                column: "AppUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
