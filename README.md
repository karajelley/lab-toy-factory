# LAB | Express Mongoose Toys

## Learning Goals

This exercise allows you to practice and apply the concepts and techniques taught in class.

Upon completion of this exercise, you will be able to:

- Use Mongoose in a Node.js project to connect to a MongoDB database and perform CRUD operations
- Create Mongoose Schemas and Models for your MongoDB collections
- Implement server routes in Express.js to handle `GET`, `POST`, and `PUT` HTTP requests
- Use Mongoose validation to limit fields and send error messages in the model
- Use `async/await` syntax with `try/catch` blocks
- Test API endpoints using Postman

---

## Introduction

You are working at a toy factory, and you need to manage the information for all the toys in production. In this exercise, you will create an Express.js backend application to retrieve and modify toy data stored in a MongoDB database.

---

## Requirements

- Fork this repo
- Clone this repo

---

## Submission

- Upon completion, run the following commands:

  ```shell
  git add .
  git commit -m "Completed lab"
  git push origin main
  ```

- Create a Pull Request and submit your assignment.

---

## Instructions

### Iteration 0 | Initial Setup

Install dependencies:

```shell
npm install
```

Install Mongoose:

```shell
npm install mongoose
```

Run the app:

```shell
npm run dev
```

---

### Iteration 1 | Connect to MongoDB

1. Import `mongoose` in the `app.js` file.
2. Set up a `mongoose` connection to a database named `toy-factory`.

⚠️ Remember to create a `.env` file and add the `MONGODB_URI` variable.

<details> 
<summary>Show solution 🙈</summary>

```javascript
const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGODB_URI )
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((error) => {
    console.error("Error connecting to the database", error);
  });
```

</details>

---

### Iteration 2 | Toy Model

Create a `Toy` model in `/models/Toy.model.js` with fields:

- `name` (String, required, unique)
- `description` (String, required, minlength 10)
- `quantity` (Number, min 0, required)
- `price` (Number, min 0, required)
- `inStock` (Boolean, default `true`)
- `created` (Date, default to now)

Example of a schema:

```javascript
const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  author: {
    type: String,
    required: true,
  },

  pages: {
    type: Number,
    min: 0,
    required: true,
  },
  published: {
    type: Date,
    required: true,
  },
});
```

Remember to create the model and export it!

<details>
<summary>Show solution 🙈</summary>

```javascript
const mongoose = require("mongoose");

const toySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
      minLength: 10,
    },
    quantity: {
      type: Number,
      min: 0,
      required: true,
    },
    price: {
      type: Number,
      min: 0,
      required: true,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    created: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Toy = mongoose.model("Toy", toySchema);

module.exports = Toy;
```

</details>

---

### Iteration 3 | Create a Toy

Add a `POST` route `/toys` that creates a new toy.
If you already have a variable `app` that is an instance of `express`, you can use it for this route.
It's not necessary that you create an extra file to handle toy routes, you can add them to the `app.js` file.

```javascript
const app = express();
```

<details>
<summary>Show solution 🙈</summary>

```javascript
app.post("/toys", async (req, res) => {
  const { name, description, quantity, price, inStock } = req.body;

  const newToy = {
    name,
    description,
    quantity,
    price,
    inStock,
  };

  try {
    const toy = await Toy.create(newToy);
    res.status(201).json(toy);
  } catch (error) {
    // check if the error includes a message
    res.status(400).json({ message: error.message }); // then send the error message, if not send a generic message
  }
});
```

</details>

Test your route using Postman and create a few toys.

---

### Iteration 4 | Get All Toys

Add a `GET` route `/toys` that retrieves all toys. We should get a response with an array of toys.

<details>
<summary>Show solution 🙈</summary>

```javascript
app.get("/toys", async (req, res) => {
  try {
    const toys = await Toy.find();
    res.status(200).json(toys);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
```

</details>

---

### Iteration 5 | Get a Specific Toy by Name

Add a `GET` route `/toys/search` that retrieves a toy by its name.
Oh wow, this is getting interesting! 🤩, now we need to use queries to handle this search.
Make the name a query parameter and use it to search for a toy by its name.
For example, if we have a toy with the name `Teddy`, we should be able to search for it using the query `/toys/search?name=Teddy`.

<details>
<summary>Show solution 🙈</summary>

```javascript
app.get("/toys/search", async (req, res) => {
  const { name } = req.query;

  try {
    const toy = await Toy.findOne
    ({ name });
    res.status(200).json(toy);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
```

</details>

#### MINI Bonus 1 | Case-insensitive Search
Can you make it so that the search is case-insensitive? 🤔

#### MINI Bonus 2 | Partial Search
Can you make it so that the search is partial? For example, if we search for `Ted`, we should get the toy with the name `Teddy`.

#### MINI Bonus 3 | No query
What if the user doesn't provide a query? Can you send all the toys?

---

### Iteration 6 | Update a Toy

Add a `PUT` route `/toys/:toyId` that updates a toy by its `_id`.
Well... this one is a bit tricky, we need to use params and also the body to update the toy.
Do you remember that `:toyId` is a parameter? How to get it? 🤔

I'm not gonna tell you hahahah 😈, you need to figure it out!

<details>
<summary>Show solution 🙈</summary>

```javascript
app.put("/toys/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description, quantity, price, inStock } = req.body;

  try {
    const toy = await Toy.findByIdAndUpdate(
      id,
      { name, description, quantity, price, inStock },
      { new: true }
    );
    res.status(200).json(toy);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
```   

</details>

---

## Testing with Postman

1. **Create a Toy**: POST `/toys`
2. **Get All Toys**: GET `/toys`
3. **Get a Toy by Name**: GET `/toys/search?name=Teddy`
4. **Update a Toy**: PUT `/toys/:id`

---

Happy Coding! ❤️
