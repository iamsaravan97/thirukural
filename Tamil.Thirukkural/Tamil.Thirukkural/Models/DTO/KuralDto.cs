using System;
using System.Collections.Generic;

#nullable disable

namespace Tamil.Thirukkural.Models.DTO
{
    public partial class KuralDto
    {
        public string Section { get; set; }
        public string FirstLine { get; set; }
        public string SecondLine { get; set; }
        public string TransFirstLine { get; set; }
        public string TransSecondLine { get; set; }
        public string DefinitionMuVa { get; set; }
        public string DefinitionPapaiya { get; set; }
        public string DefinitionKalaignar { get; set; }
        public string English { get; set; }
        public string Explanation { get; set; }
        public string Transliteration { get; set; }
        public string ChapterEnglish { get; set; }
        public string ChapterTranslate { get; set; }
        public string Cg { get; set; }
        public string CgEnglish { get; set; }
        public string CgTranslate { get; set; }
        public string SectionEnglish { get; set; }
        public string SectionTranslate { get; set; }
        public string Chapter { get; set; }
        public int SectionId { get; set; }
        public int ChapterId { get; set; }
        public int CgId { get; set; }
        public int KuralId { get; set; }
        public string Id { get; set; }
    }
}
