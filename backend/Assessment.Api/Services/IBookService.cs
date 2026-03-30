using Assessment.Api.Models;

namespace Assessment.Api.Services
{
    public interface IBookService
    {
        /// <summary>
        /// Retrieve a list of books
        /// </summary>
        IEnumerable<BookViewModel> GetAll();

        /// <summary>
        /// Retrieve a book by its id
        /// </summary>
        /// <param name="id"></param>
        BookViewModel? GetById(Guid id);

        /// <summary>
        /// Add a book, when the author does not exist, create one
        /// </summary>
        /// <param name="book"></param>
        void AddBook(BookViewModel book);
    }
}
