using Assessment.Api.Models;

namespace Assessment.Api.Services
{
    public class BookService : IBookService
    {
        private readonly Dictionary<Guid, BookViewModel> _books = new ();

        public IEnumerable<BookViewModel> GetAll()
        {
            return _books.Values;
        }

        public BookViewModel? GetById(Guid id)
        {
            return _books.GetValueOrDefault(id);
        }

        public void AddBook(BookViewModel book)
        {
            book.Id = Guid.NewGuid();
            _books.Add(book.Id, book);
        }
    }
}
