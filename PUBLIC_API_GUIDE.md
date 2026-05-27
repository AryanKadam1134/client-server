# Public Portfolio API Integration Guide

Use these **public** endpoints to fetch a user's portfolio data by username. No authentication is required.

## Base URL

If your backend runs at `http://localhost:5000`, the base URL is:

```
http://localhost:5000/api/portfolio/:username
```

Replace `:username` with the portfolio owner's username.

## Response Envelope

All public endpoints return an `ApiRes` envelope:

```json
{
  "statusCode": 200,
  "data": {},
  "message": "string",
  "success": true
}
```

On error, the server responds with:

```json
{
  "success": false,
  "status": 400,
  "message": "string"
}
```

## Example (Fetch)

```js
const username = "john_doe";
const base = "http://localhost:5000/api/portfolio";

const res = await fetch(`${base}/${username}/details`);
const json = await res.json();
console.log(json.data);
```

---

## Endpoints

### GET `/api/portfolio/:username/details`

Returns the user's public profile details.

**`data` shape:**
```json
{
  "_id": "ObjectId",
  "username": "string",
  "email": "string",
  "firstName": "string",
  "middleName": "string | null",
  "lastName": "string | null",
  "headline": "string | null",
  "about": "string | null",
  "mobileNo": "number | null",
  "gender": "male | female | other | null",
  "location": {
    "country": "string | null",
    "state": "string | null",
    "city": "string | null"
  },
  "documentUrl": "string | null",
  "image": {
    "url": "string | null",
    "public_id": "string | null",
    "resource_type": "string | null"
  },
  "resumeOrCv": {
    "url": "string | null",
    "public_id": "string | null",
    "resource_type": "string | null"
  },
  "createdAt": "ISO date",
  "updatedAt": "ISO date"
}
```

---

### GET `/api/portfolio/:username/social-platforms`

Returns public social platforms sorted by `sortOrder`.

**`data` shape:**
```json
[
  {
    "_id": "ObjectId",
    "owner": "ObjectId",
    "name": "string",
    "link": "string (URL)",
    "visibility": "public",
    "sortOrder": "number",
    "createdAt": "ISO date",
    "updatedAt": "ISO date"
  }
]
```

---

### GET `/api/portfolio/:username/skills`

Returns public skills with their category details.

**`data` shape:**
```json
[
  {
    "_id": "ObjectId",
    "owner": "ObjectId",
    "name": "string",
    "description": "string | null",
    "level": "basic | intermediate | advance",
    "visibility": "public",
    "sortOrder": "number",
    "categoryId": "ObjectId | null",
    "category": {
      "_id": "ObjectId",
      "owner": "ObjectId",
      "name": "string",
      "visibility": "public | private",
      "sortOrder": "number",
      "createdAt": "ISO date",
      "updatedAt": "ISO date"
    }
  }
]
```

---

### GET `/api/portfolio/:username/categories`

Returns public skill categories with their public skills.

**`data` shape:**
```json
[
  {
    "_id": "ObjectId",
    "owner": "ObjectId",
    "name": "string",
    "visibility": "public",
    "sortOrder": "number",
    "skills": [
      {
        "_id": "ObjectId",
        "owner": "ObjectId",
        "name": "string",
        "description": "string | null",
        "level": "basic | intermediate | advance",
        "visibility": "public",
        "sortOrder": "number",
        "categoryId": "ObjectId"
      }
    ]
  }
]
```

---

### GET `/api/portfolio/:username/projects`

Returns public projects. You can filter by featured:

```
?featured=true | false | all
```

**`data` shape:**
```json
[
  {
    "_id": "ObjectId",
    "owner": "ObjectId",
    "organizationId": "ObjectId | null",
    "organizationDetails": {
      "_id": "ObjectId",
      "organization": "string",
      "location": "string | null",
      "locationType": "on-site | remote | hybrid",
      "organizationImage": {
        "url": "string | null",
        "public_id": "string | null",
        "resource_type": "string | null"
      }
    },
    "title": "string",
    "description": "string | null",
    "startDate": "ISO date | null",
    "endDate": "ISO date | null",
    "isCurrent": "boolean",
    "category": "personal | freelance | hackathon | client | open-source",
    "techStack": [
      {
        "_id": "ObjectId",
        "name": "string"
      }
    ],
    "coverImageIndex": "number | null",
    "projectImages": [
      {
        "url": "string",
        "public_id": "string",
        "resource_type": "string"
      }
    ],
    "githubLink": "string | null",
    "liveLink": "string | null",
    "featured": "boolean",
    "visibility": "public",
    "sortOrder": "number",
    "createdAt": "ISO date",
    "updatedAt": "ISO date"
  }
]
```

---

### GET `/api/portfolio/:username/experiences`

Returns public work experiences with tech stack expanded.

**`data` shape:**
```json
[
  {
    "_id": "ObjectId",
    "owner": "ObjectId",
    "organization": "string",
    "description": "string | null",
    "organizationSize": "string | null",
    "organizationWebsite": "string | null",
    "positions": [
      {
        "role": "string",
        "startDate": "ISO date",
        "endDate": "ISO date | null",
        "isCurrent": "boolean"
      }
    ],
    "latestDate": "ISO date | null",
    "employmentType": "full-time | part-time | contract | freelance | internship | apprenticeship",
    "highlights": ["string"],
    "techStack": [
      {
        "_id": "ObjectId",
        "name": "string"
      }
    ],
    "location": "string | null",
    "locationType": "on-site | remote | hybrid",
    "organizationImage": {
      "url": "string | null",
      "public_id": "string | null",
      "resource_type": "string | null"
    },
    "visibility": "public",
    "createdAt": "ISO date",
    "updatedAt": "ISO date"
  }
]
```

---

### GET `/api/portfolio/:username/educations`

Returns education entries for the user.

**`data` shape:**
```json
[
  {
    "_id": "ObjectId",
    "owner": "ObjectId",
    "instituteName": "string",
    "qualification": "string",
    "description": "string | null",
    "location": "string | null",
    "startYear": "number",
    "endYear": "number | null",
    "isCurrent": "boolean",
    "latestYear": "number",
    "percentage": "number | null",
    "cgpa": "number | null",
    "instituteImage": {
      "url": "string | null",
      "public_id": "string | null",
      "resource_type": "string | null"
    },
    "createdAt": "ISO date",
    "updatedAt": "ISO date"
  }
]
```

---

### GET `/api/portfolio/:username/certificates`

Returns public certificates. You can filter by featured:

```
?featured=true | false | all
```

**`data` shape:**
```json
[
  {
    "_id": "ObjectId",
    "owner": "ObjectId",
    "title": "string",
    "description": "string | null",
    "issuer": "string",
    "credentialId": "string | null",
    "credentialUrl": "string | null",
    "certificateImage": {
      "url": "string | null",
      "public_id": "string | null",
      "resource_type": "string | null"
    },
    "issueDate": "ISO date | null",
    "expiryDate": "ISO date | null",
    "skills": [
      {
        "_id": "ObjectId",
        "name": "string"
      }
    ],
    "featured": "boolean",
    "visibility": "public",
    "sortOrder": "number",
    "createdAt": "ISO date",
    "updatedAt": "ISO date"
  }
]
```

---

### GET `/api/portfolio/:username/achievements`

Returns public achievements. You can filter by featured:

```
?featured=true | false | all
```

**`data` shape:**
```json
[
  {
    "_id": "ObjectId",
    "owner": "ObjectId",
    "title": "string",
    "description": "string | null",
    "issuer": "string | null",
    "link": "string | null",
    "date": "ISO date | null",
    "location": "string | null",
    "certificateId": "ObjectId | null",
    "certificateDetails": {
      "_id": "ObjectId",
      "title": "string",
      "issuer": "string",
      "credentialUrl": "string | null",
      "certificateImage": {
        "url": "string | null",
        "public_id": "string | null",
        "resource_type": "string | null"
      }
    },
    "coverImageIndex": "number | null",
    "achievementImages": [
      {
        "url": "string",
        "public_id": "string",
        "resource_type": "string"
      }
    ],
    "featured": "boolean",
    "visibility": "public",
    "sortOrder": "number",
    "createdAt": "ISO date",
    "updatedAt": "ISO date"
  }
]
```
