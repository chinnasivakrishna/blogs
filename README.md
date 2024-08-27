Here's a documentation outline for the front-end part of project:

---

## Front-End Documentation

### Overview

The front-end of this project is built using React. It provides an interface for users to interact with a blogging platform, allowing them to view, add, edit, and delete blogs. The application includes several components and routing to manage user navigation and protected routes. 

### Key Components

1. **App Component (`App.js`)**

   The `App` component is the root component that sets up routing for the application. It uses `react-router-dom` for navigation and includes the following routes:
   - `/login`: Renders the `Login` component.
   - `/register`: Renders the `Register` component.
   - `/`: Renders the `Home` component inside a `Layout` that includes a sidebar.
   - `/add-blog`: Renders the `AddBlog` component wrapped in a `ProtectedRoute` to restrict access to authenticated users.
   - `/my-blog`: Renders the `MyBlogs` component, also wrapped in a `ProtectedRoute`.
   - `/blog/:id`: Renders the `Content` component, showing detailed information about a specific blog, protected by `ProtectedRoute`.

   ```jsx
   function App() {
     return (
       <Router>
         <Header />
         <Routes>
           <Route path="/login" element={<Login />} />
           <Route path="/register" element={<Register />} />
           <Route path="/" element={<Layout><Home /></Layout>} />
           <Route path="/add-blog" element={<ProtectedRoute><Layout><AddBlog /></Layout></ProtectedRoute>} />
           <Route path="/my-blog" element={<ProtectedRoute><Layout><MyBlogs /></Layout></ProtectedRoute>} />
           <Route path="/blog/:id" element={<ProtectedRoute><Layout><Content /></Layout></ProtectedRoute>} />
         </Routes>
       </Router>
     );
   }
   ```

2. **ProtectedRoute Component (`ProtectedRoute.js`)**

   The `ProtectedRoute` component checks for an authentication token in cookies. If the token exists, it renders the child components; otherwise, it redirects the user to the login page.

   ```jsx
   const ProtectedRoute = ({ children }) => {
     const token = Cookies.get('jwt_token');
     return token ? children : <Navigate to="/login" />;
   };
   ```

3. **MyBlogs Component (`MyBlogs.js`)**

   The `MyBlogs` component allows users to view, edit, and delete their blogs. It fetches the user's blogs from an API and displays them in a list. Users can update or delete individual blogs and add new content to existing blogs.

   - **State Management**: Manages state for blogs, editing mode, and image previews.
   - **API Integration**: Fetches blogs, updates, and deletes using `axios`.
   - **Event Handlers**: Handles blog clicks, deletion, and updates with form submissions and file uploads.

4. **Home Component (`Home.js`)**

   The `Home` component displays a list of all blogs. It includes a search feature to filter blogs based on the search query. Users can click on a blog to view detailed content.

   - **State Management**: Manages state for blogs and search queries.
   - **API Integration**: Fetches all blogs from the API and filters them based on the search query.

5. **Header Component (`Header.js`)**

   The `Header` component provides navigation and search functionality. It includes buttons for login, logout, and joining, with conditional rendering based on authentication status.

   - **State Management**: Manages search input and authentication state.
   - **Event Handlers**: Handles search input changes and logout functionality.

6. **Content Component (`Content.js`)**

   The `Content` component shows detailed information about a single blog, including the title, image, and content sections. It also handles user comments, allowing authenticated users to post and view comments.

   - **State Management**: Manages state for the blog, comments, and comment input.
   - **API Integration**: Fetches blog details and comments, posts new comments.
   - **Event Handlers**: Handles comment submission and blog detail display.

### Styling

Each component has a corresponding CSS file for styling:

- `App.css`: General app-wide styles.
- `Header.css`: Styles for the header component.
- `Home.css`: Styles for the home page.
- `MyBlogs.css`: Styles for the MyBlogs component.
- `Content.css`: Styles for the content page.

### Dependencies

- **React**: A JavaScript library for building user interfaces.
- **react-router-dom**: A library for handling routing in React applications.
- **axios**: A promise-based HTTP client for making API requests.
- **js-cookie**: A library for handling cookies.

### How to Run

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm start
   ```

3. Navigate to `http://localhost:3000` in your browser to view the application.

### Additional Notes

- Ensure that the backend API endpoints are correctly configured and accessible.
- Authentication tokens should be properly managed and secured.

---

