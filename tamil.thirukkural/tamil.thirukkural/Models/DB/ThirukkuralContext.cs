using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

#nullable disable

namespace Tamil.Thirukkural.Models.DB
{
    public partial class ThirukkuralContext : DbContext
    {
        public ThirukkuralContext()
        {
        }

        public ThirukkuralContext(DbContextOptions<ThirukkuralContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Kural> Kurals { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
                optionsBuilder.UseSqlServer("Data Source=./.;Initial Catalog=Thirukkural;Integrated Security=True;Connect Timeout=30;Encrypt=False;TrustServerCertificate=False;");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasAnnotation("Relational:Collation", "SQL_Latin1_General_CP1_CI_AS");

            modelBuilder.Entity<Kural>(entity =>
            {
                entity.ToTable("kural");

                entity.Property(e => e.Id)
                    .HasMaxLength(24)
                    .IsUnicode(false);

                entity.Property(e => e.Cg)
                    .IsRequired()
                    .HasMaxLength(10)
                    .HasColumnName("CG");

                entity.Property(e => e.CgEnglish)
                    .IsRequired()
                    .HasMaxLength(25)
                    .HasColumnName("CG_english");

                entity.Property(e => e.CgId).HasColumnName("CG_id");

                entity.Property(e => e.CgTranslate)
                    .IsRequired()
                    .HasMaxLength(16)
                    .HasColumnName("CG_translate");

                entity.Property(e => e.Chapter)
                    .IsRequired()
                    .HasMaxLength(24)
                    .HasColumnName("chapter");

                entity.Property(e => e.ChapterEnglish)
                    .IsRequired()
                    .HasMaxLength(40)
                    .HasColumnName("chapter_english");

                entity.Property(e => e.ChapterId).HasColumnName("chapter_id");

                entity.Property(e => e.ChapterTranslate)
                    .IsRequired()
                    .HasMaxLength(30)
                    .HasColumnName("chapter_translate");

                entity.Property(e => e.DefinitionKalaignar)
                    .IsRequired()
                    .HasMaxLength(362)
                    .HasColumnName("definition_kalaignar");

                entity.Property(e => e.DefinitionMuVa)
                    .IsRequired()
                    .HasMaxLength(158)
                    .HasColumnName("definition_MuVa");

                entity.Property(e => e.DefinitionPapaiya)
                    .IsRequired()
                    .HasMaxLength(436)
                    .HasColumnName("definition_Papaiya");

                entity.Property(e => e.English)
                    .IsRequired()
                    .HasMaxLength(156)
                    .HasColumnName("english");

                entity.Property(e => e.Explanation)
                    .IsRequired()
                    .HasMaxLength(210)
                    .HasColumnName("explanation");

                entity.Property(e => e.FirstLine)
                    .IsRequired()
                    .HasMaxLength(50)
                    .HasColumnName("firstLine");

                entity.Property(e => e.SecondLine)
                    .IsRequired()
                    .HasMaxLength(37)
                    .HasColumnName("secondLine");

                entity.Property(e => e.Section)
                    .IsRequired()
                    .HasMaxLength(13)
                    .HasColumnName("section");

                entity.Property(e => e.SectionEnglish)
                    .IsRequired()
                    .HasMaxLength(6)
                    .HasColumnName("section_english");

                entity.Property(e => e.SectionId).HasColumnName("section_id");

                entity.Property(e => e.SectionTranslate)
                    .IsRequired()
                    .HasMaxLength(17)
                    .HasColumnName("section_translate");

                entity.Property(e => e.Transliteration)
                    .IsRequired()
                    .HasMaxLength(81)
                    .HasColumnName("transliteration");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
