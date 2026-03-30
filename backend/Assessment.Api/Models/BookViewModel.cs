namespace Assessment.Api.Models
{
    public class BookViewModel
    {
        public Guid Id { get; set; }
        public string? Title { get; set; }
        public string? AuthorName { get; set; }
        public double Price { get; set; }
    }
}
