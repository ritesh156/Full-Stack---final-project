"" Dynamic Feature Store "" 

- A full-stack web project that stores, updates, and retrieves features (data attributes) for different entities (like users, products, devices, etc.).
- It includes a Node.js + SQLite backend and a simple HTML, CSS, JS frontend.


## How It Works - 

-Frontend (UI):
User enters entity_id, feature name, and value.
Can add (ingest) or query features.

-Backend (Server):
Built using Express.js and SQLite database.
Stores each feature with name, value, entity ID, and timestamp.
Provides APIs to add, update, delete, and fetch features.

-Database:
Saves all features in a table.
Supports quick search and latest feature retrieval.



## Uses -
Helps in machine learning systems to store and retrieve latest user or product data.
Can be used in data analytics dashboards.
Useful for dynamic configuration of apps (store feature flags or settings).
Helps developers manage real-time feature updates easily.


