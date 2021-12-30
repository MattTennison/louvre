# Louvre

This is a Cloudflare worker designed to serve images quickly from the Pexels API using a local cache. The intended use-case was for new tab pages to serve random background images quickly (and let me play about with Cloudflare workers...).

## Architecture

There aren't many moving parts - the architecture looks like this:

![Architecture - source PlantUML is available in repo at docs/sequence.plantuml](http://www.plantuml.com/plantuml/proxy?cache=no&src=https://raw.githubusercontent.com/matttennison/louvre/main/docs/sequence.plantuml)

## Limitations

- Only supports photos for "minimalism" photos rather than several search terms
- Doesn't do any analysis on images Pexels returns - e.g. an enhancement could be to send each photo to a cloud moderation service like AWS Rekognition to filter out NSFW results.
