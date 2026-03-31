export interface IBookDto {
  id: string;
  title: string | null;
  authorName: string | null;
  price: number;
}

export interface ICreateBookPayload {
  title: string;
  authorName: string;
  price: number;
}

/* In a large app I would probably create semantic types e.g. type id = string, type timestamp = string

then create reusable types e.g.
type Timestamps = {
  createdAt: string;
  updatedAt: string;
  deletedAt?: string; // or a semantic Nullable type;
}

not necessary needed or could use branded types but it can prevent db confusion for if epochs are used instead of ISO strings. And makes things just nicely readable.


then create shared entity types 
type BaseEntity = {
  id: string;
} & Timestamps;

usage 
type BoxOfOninons = BaseEntity & {
  factory: string;
  weight: number;
} */

// obviously somewhat domain dependent but I like the idea
