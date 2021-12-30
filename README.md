# Louvre

This is a Cloudflare worker designed to serve images quickly from the Pexels API using a local cache. The intended use-case was for new tab pages to serve random background images quickly (and let me play about with Cloudflare workers...). At the moment it only serves "minimalism" photos but the idea is to extend it to support any search term.

## Architecture

There aren't many moving parts - the architecture looks like this:

![Architecture - source PlantUML is available in repo at docs/sequence.plantuml](http://www.plantuml.com/plantuml/proxy?cache=no&src=https://raw.githubusercontent.com/matttennison/louvre/main/docs/sequence.plantuml)
