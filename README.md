🚧 This is work in progress

---

# 🌲 piny.link

> API server for tiny bookmarking service

## Requirements

- [node](https://nodejs.org) 14.x

## Quick start

Install dependencies:

```sh
npm install
```

Create empty database:

```sh
npm run sync
```

Start dev server:

```sh
KEY="secret-key" npm run dev
```

Production:

```sh
KEY="secret-key" npm start
```

## API

This doc assume that your server running on https://dev.piny.link. The request examples uses [`httpie`](https://httpie.org).

Emoji key:

- 🌍 Public endpoint
- 🔐 Requires authorisation

Headers:

- `Content-Type: application/json` — default body type
- `Authorization: Bearer XXX` — replace `XXX` with `token` from `/login` response (🔐 restricted endpoints only)

### 🌍 Create user

```sh
POST /signup
```

#### Body

- `user: string` — user name (unique)
- `pass: string` — user password (no restrictions)
- `email: string` — user email (unique)

#### Request

```sh
http --json POST 'https://dev.piny.link/signup' \
  'Content-Type':'application/json' \
  user="foo" \
  pass="1234" \
  email="foo@bar.baz"
```

#### Response

##### 201

```sh
{
  "message": "👋 Welcome, please /login"
}
```

### 🌍 Log in

```sh
POST /login
```

#### Body

- `user: string` — user name
- `pass: string` — user password

#### Request

```sh
http --json POST 'https://dev.piny.link/login' \
  'Content-Type':'application/json' \
  pass="1234" \
  user="foo"
```

#### Response

##### 200

```sh
{
  "token": "XXX",
}
```

### 🔐 Log out

```sh
GET /logout
```

#### Request

```sh
http GET 'https://dev.piny.link/logout' \
  'Authorization':'Bearer XXX'
```

#### Response

##### 200

```sh
{
  "message": "👋 Bye"
}
```

### 🔐 Get user

```sh
GET /:user
```

#### Params

- `user: string` — user name

#### Request

```sh
http GET 'https://dev.piny.link/:user' \
  'Authorization':'Bearer XXX'
```

#### Response

##### 200

```sh
{
  "id": "YYY",
  "name": "foo",
  "email": "foo@bar.baz"
}
```

### 🌍/🔐 Get user bookmarks

```sh
GET /:user?/bookmarks
```

#### Params

- `user?: string` — user name (if omitted, get bookmarks of current user)

#### Request

```sh
http GET 'https://dev.piny.link/:user/bookmarks' \
  'Authorization':'Bearer XXX'
```

#### Response

##### 200

```sh
[
  {
    "id": "ff7b3bb2-5fad-4924-81a6-5bedc3ded3dd",
    "title": "KayWay",
    "description": "Illustration portfolio by Ekaterina Grishina",
    "state": "active",
    "privacy": "public",
    "link": {
      "id": "a6f7584f-c1a5-42e8-bd98-e1bb003fc219",
      "url": "https://kayway.me/"
    },
    "tags": [
      {
        "id": "2c00e362-30fc-4dba-89ed-24c0a3d11ab4",
        "name": "illustrator"
      },
      {
        "id": "823e8339-2296-4972-aeed-951df1826228",
        "name": "portfolio"
      }
    ],
    "createdAt": "2020-08-02T00:34:45.000Z",
    "updatedAt": "2020-08-02T00:34:45.000Z"
  },
  ...
]
```

### 🔐 Get user tags

```sh
GET /:user?/tags
```

#### Params

- `user: string` — user name

#### Request

```sh
http GET 'https://dev.piny.link/:user/tags' \
  'Authorization':'Bearer XXX'
```

#### Response

##### 200

```sh
[
  {
    "id": "2c00e362-30fc-4dba-89ed-24c0a3d11ab4",
    "name": "illustrator"
  },
  {
    "id": "823e8339-2296-4972-aeed-951df1826228",
    "name": "portfolio"
  }
]
```

### 🔐 Create bookmark

```sh
POST /bookmarks
```

#### Body

- `url: string` — bookmark url
- `title?: string` — bookmark title (optional)
- `description?: string` — bookmark description (optional)
- `privacy: 'public'` — access to bookmark (only `'public'` supported at the moment)
- `tags?: string[]` — list of tags that should be assigned to the bookmark, will be added to the user tags (optional)

#### Request

```sh
http --json POST 'https://dev.piny.link/bookmarks' \
  'Authorization':'Bearer XXX' \
  'Content-Type':'application/json' \
  title="KayWay" \
  description="Illustration portfolio by Ekaterina Grishina" \
  url="https://kayway.me" \
  privacy="public" \
  tags:="[
    \"illustrator\",
    \"portfolio\"
  ]"
```

#### Response

##### 201

```sh
{
  "message": "✨ Created"
}
```

### 🔐 Edit bookmark

```sh
PATCH /bookmarks/:id
```

#### Params

- `id: string` — bookmark id

#### Body

- `url?: string` — bookmark url (optional)
- `title?: string` — bookmark title (optional)
- `description?: string` — bookmark description (optional)
- `privacy?: 'public'` — access to bookmark (only `'public'` supported at the moment) (optional)
- `tags?: string[]` — list of tags that should be assigned to the bookmark, will be added to the user tags (optional)

#### Request

```sh
http --json PATCH 'https://dev.piny.link/bookmarks/:id' \
  'Authorization':'Bearer XXX' \
  'Content-Type':'application/json' \
  title="KayWay" \
  description="Illustration portfolio by Ekaterina Grishina" \
  tags:="[
    \"illustrator\",
    \"portfolio\"
  ]"
```

#### Response

##### 200

```sh
{
  "message": "💾 Saved"
}
```

### 🔐 Delete bookmark

```sh
DELETE /bookmarks/:id
```

#### Params

- `id: string` — bookmark id

#### Request

```sh
http DELETE 'https://dev.piny.link/bookmarks/:id' \
  'Authorization':'Bearer XXX'
```

##### 200

```sh
{
  "message": "🗑 Removed"
}
```

---

© Ivan Grishin
