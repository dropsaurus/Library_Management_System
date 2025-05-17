// Sample books data
const sampleBooks = [
  {
    BOOK_NAME: "The Great Gatsby",
    AUTHOR_NAME: "F. Scott Fitzgerald",
    TOPIC_NAME: "Fiction",
    IMAGE_URL:
      "https://images.unsplash.com/photo-1541963463532-d68292c34b19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    DESCRIPTION: "A classic novel set in the roaring twenties.",
  },
  {
    BOOK_NAME: "Sapiens: A Brief History of Humankind",
    AUTHOR_NAME: "Yuval Noah Harari",
    TOPIC_NAME: "History",
    IMAGE_URL:
      "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    DESCRIPTION: "A groundbreaking exploration of human history.",
  },
  {
    BOOK_NAME: "Atomic Habits",
    AUTHOR_NAME: "James Clear",
    TOPIC_NAME: "Self-Help",
    IMAGE_URL:
      "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    DESCRIPTION: "Practical strategies for building better habits.",
  },
  {
    BOOK_NAME: "The Silent Patient",
    AUTHOR_NAME: "Alex Michaelides",
    TOPIC_NAME: "Mystery",
    IMAGE_URL:
      "https://images.unsplash.com/photo-1479894127662-a987d1e38f82?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    DESCRIPTION: "A psychological thriller about a woman's mysterious silence.",
  },
  {
    BOOK_NAME: "Harry Potter and the Philosopher's Stone",
    AUTHOR_NAME: "J.K. Rowling",
    TOPIC_NAME: "Fantasy",
    IMAGE_URL:
      "https://images.unsplash.com/photo-1618666012174-83b441c0bc76?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    DESCRIPTION: "The first book in the beloved series about a young wizard.",
  },
  {
    BOOK_NAME: "Educated",
    AUTHOR_NAME: "Tara Westover",
    TOPIC_NAME: "Memoir",
    IMAGE_URL:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    DESCRIPTION: "A memoir about overcoming obstacles for education.",
  },
  {
    BOOK_NAME: "1984",
    AUTHOR_NAME: "George Orwell",
    TOPIC_NAME: "Dystopian",
    IMAGE_URL:
      "https://images.unsplash.com/photo-1614332287897-cdc485fa562d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    DESCRIPTION: "A chilling vision of a totalitarian future society.",
  },
  {
    BOOK_NAME: "To Kill a Mockingbird",
    AUTHOR_NAME: "Harper Lee",
    TOPIC_NAME: "Classic",
    IMAGE_URL:
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    DESCRIPTION: "A powerful story of racial injustice and moral growth.",
  },
];

// Sample events data
const sampleEvents = [
  {
    E_NAME: "Summer Reading Challenge",
    E_TYPE: "S",
    TOPIC_NAME: "Reading",
    E_STARTTIME: "2024-07-15T10:00:00",
    IMAGE_URL:
      "https://images.unsplash.com/photo-1519682577862-22b62b24e493?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    DESCRIPTION: "Join our annual summer reading challenge and win prizes.",
  },
  {
    E_NAME: "Author Meet & Greet",
    E_TYPE: "S",
    TOPIC_NAME: "Literature",
    E_STARTTIME: "2024-07-22T14:00:00",
    IMAGE_URL:
      "https://images.unsplash.com/photo-1531058020387-3be344556be6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    DESCRIPTION: "Meet bestselling authors discussing their latest work.",
  },
  {
    E_NAME: "Children's Book Exhibition",
    E_TYPE: "E",
    TOPIC_NAME: "Children's Lit",
    E_STARTTIME: "2024-08-01T09:00:00",
    IMAGE_URL:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    DESCRIPTION:
      "Explore a colorful exhibition of children's book illustrations.",
  },
  {
    E_NAME: "Poetry Reading Evening",
    E_TYPE: "S",
    TOPIC_NAME: "Poetry",
    E_STARTTIME: "2024-08-10T18:00:00",
    IMAGE_URL:
      "https://images.unsplash.com/photo-1470472304068-4398a9daab00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    DESCRIPTION: "Join us for an evening of poetry readings from local poets.",
  },
  {
    E_NAME: "Rare Books Collection Tour",
    E_TYPE: "E",
    TOPIC_NAME: "History",
    E_STARTTIME: "2024-08-15T11:00:00",
    IMAGE_URL:
      "https://images.unsplash.com/photo-1573592371950-348a8f1d9f38?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    DESCRIPTION: "A guided tour of our rare books collection.",
  },
  {
    E_NAME: "Digital Reading Workshop",
    E_TYPE: "S",
    TOPIC_NAME: "Technology",
    E_STARTTIME: "2024-08-20T15:00:00",
    IMAGE_URL:
      "https://images.unsplash.com/photo-1526406915894-7bcd65f60845?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    DESCRIPTION: "Learn about e-readers and digital library resources.",
  },
  {
    E_NAME: "Creative Writing Seminar",
    E_TYPE: "S",
    TOPIC_NAME: "Writing",
    E_STARTTIME: "2024-09-05T14:00:00",
    IMAGE_URL:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    DESCRIPTION:
      "Develop your creative writing skills with professional authors.",
  },
  {
    E_NAME: "Book Binding Workshop",
    E_TYPE: "S",
    TOPIC_NAME: "Crafts",
    E_STARTTIME: "2024-09-12T13:00:00",
    IMAGE_URL:
      "https://images.unsplash.com/photo-1576633587382-13ddf37b1b1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    DESCRIPTION:
      "Learn traditional book binding techniques and create your own journal.",
  },
  {
    E_NAME: "Classic Literature Discussion",
    E_TYPE: "S",
    TOPIC_NAME: "Literature",
    E_STARTTIME: "2024-09-20T18:30:00",
    IMAGE_URL:
      "https://images.unsplash.com/photo-1517770413964-df8ca61194a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    DESCRIPTION:
      "Join our monthly discussion group focusing on classic literary works.",
  },
  {
    E_NAME: "Science Fiction Film Screening",
    E_TYPE: "S",
    TOPIC_NAME: "Film",
    E_STARTTIME: "2024-10-05T19:00:00",
    IMAGE_URL:
      "https://images.unsplash.com/photo-1543536448-d209d2122143?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    DESCRIPTION:
      "Watch and discuss influential science fiction films based on literary works.",
  },
];
