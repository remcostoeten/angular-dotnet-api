using Assessment.Api.Models;
using Assessment.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace Assessment.Api.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class BooksController : ControllerBase
    {
        private readonly IBookService _bookService;

        public BooksController(IBookService bookService)
        {
            _bookService = bookService;
        }

        [HttpGet]
        public IEnumerable<BookViewModel> Get()
        {
            return _bookService.GetAll();
        }

        [HttpGet("{id:guid}")]
        public BookViewModel? Get(Guid id)
        {
            return _bookService.GetById(id);
        }

        [HttpPost]
        public void Add(BookViewModel book)
        {
            _bookService.AddBook(book);
        }
    }
}
