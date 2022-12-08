# Louvre

This is a Cloudflare worker designed to serve images quickly from the [Pexels API](https://www.pexels.com/api/) using a local cache. The intended use-case was for new tab pages to serve random background images quickly (and let me play about with Cloudflare workers...).

## Architecture

There aren't many moving parts - the architecture looks like this:

![Architecture - source PlantUML is available in repo at docs/sequence.plantuml](http://www.plantuml.com/plantuml/proxy?cache=no&src=https://raw.githubusercontent.com/matttennison/louvre/main/docs/sequence.plantuml)

## Limitations

- Only supports photos for "minimalism" photos rather than several search terms
- Doesn't do any analysis on images Pexels returns - e.g. an enhancement could be to send each photo to a cloud moderation service like AWS Rekognition to filter out NSFW results.

## Usage

GET request to production deployment: https://louvre.matttennison.workers.dev/

[The E2E snapshots](test/e2e/__snapshots__/e2e.test.ts.snap) shows some example responses that are kept up to date (assuming a passing build).

### Example using httpie

```bash
matt@pop-os:~/code/louvre$ http GET https://louvre.matttennison.workers.dev/
HTTP/1.1 200 OK
Access-Control-Allow-Origin: *
CF-RAY: 6c5ca9602dfde68c-LHR
Connection: keep-alive
Content-Encoding: gzip
Content-Type: application/json
Date: Thu, 30 Dec 2021 16:32:00 GMT
Expect-CT: max-age=604800, report-uri="https://report-uri.cloudflare.com/cdn-cgi/beacon/expect-ct"
NEL: {"success_fraction":0,"report_to":"cf-nel","max_age":604800}
Report-To: {"endpoints":[{"url":"https:\/\/a.nel.cloudflare.com\/report\/v3?s=mIj0BJFDsB7pcfOIHeyskXL63Ivul2tfQGdkuRyAQ5wkdJEFn57M1DyYsVH5KpeDtKxZ3pCzFg8ObRjuHloGqYDgn6loYD3%2B8Q0AkdwhlA2Gsv9DgfrObN57c9mtIQFx51uEyGgu5YfhY7MJm4rao1za"}],"group":"cf-nel","max_age":604800}
Server: cloudflare
Transfer-Encoding: chunked
Vary: Accept-Encoding
alt-svc: h3=":443"; ma=86400, h3-29=":443"; ma=86400, h3-28=":443"; ma=86400, h3-27=":443"; ma=86400

{
    "data": {
        "photo": {
            "attribution": {
                "link": {
                    "source": "Pexels",
                    "url": "https://www.pexels.com/photo/green-plant-with-white-ceramic-pot-1084188/"
                },
                "photographer": {
                    "name": "Juan Pablo Serrano Arenas",
                    "url": "https://www.pexels.com/@juanpphotoandvideo"
                }
            },
            "avg_color": "#C9C2B5",
            "src": "https://images.pexels.com/photos/1084188/pexels-photo-1084188.jpeg"
        }
    }
}
```
