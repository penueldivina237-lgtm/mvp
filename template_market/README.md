# Template Market — Frontend Demo

This is a frontend-only demo that bundles 100 website templates and a client-side search/filter UI.

Quick start (serve static files):

```bash
cd template_market
python3 -m http.server 5501
# then open http://localhost:5501
```

Notes:
- Images are fetched from `https://source.unsplash.com` using each template's `imgQuery`.
- The purchase flow is a front-end simulation only; integrate a payment provider for production.
- To change pricing or categories edit `templates.json`.

Next steps I can take for you:
- Add pagination or infinite scroll
- Add cart + real checkout integration (Stripe/PayPal)
- Add admin panel to manage templates
