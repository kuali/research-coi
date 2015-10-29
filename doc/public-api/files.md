## File [/api/coi/files/:id]

## Get File [GET]

Requires valid API key. Users can only view their own files, admins can view any file.

+ Paramaters
    + id: `1` (number, required) = The id of the file being deleted

+ Request

    + Headers

            Authorization: Bearer {authToken}

+ Response 200

    + Body

            Data

## Delete File [DELETE]

Requires valid API key. Users can only delete their own files

+ Paramaters
    + id: `1` (number, required) = The id of the file being deleted

+ Request

    + Headers

            Authorization: Bearer {authToken}

+ Response 200

## Files [/api/coi/files]

## Create File [POST]

Requires valid API key. Users can only revise questions which are associated with their disclosures

+ Request

    + Headers

            Authorization: Bearer {authToken}
            Content-Type: multipart/form-data; boundary=---------------------------34625135819133741831659763503

    + Body

            -----------------------------34625135819133741831659763503
            Content-Disposition: form-data; name="attachments"; filename="test.pdf"
            Content-Type: "\"application/pdf\""

            Data

            -----------------------------34625135819133741831659763503
            Content-Disposition: form-data; name="data"

            {"refId":1502,"type":"financialEntity","disclosureId":503}
            -----------------------------34625135819133741831659763503--


+ Response 200

    + Headers

            Content-Type: application/json; charset=utf-8

    + Body

            [
              {
                "file_type":"financialEntity",
                "ref_id":1502,
                "type":"\"application/pdf\"",
                "key":"c5d71716632dbdd9985a77c7c7369685",
                "name":"test.pdf",
                "user_id":"10000000007",
                "uploaded_by":"Blood, Opal",
                "upload_date":"2015-10-29T14:05:05.791Z",
                "id":5
              }
            ]