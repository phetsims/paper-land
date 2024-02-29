---
# YAML header
render_macros: true
---
# Walkthroughs

## Using Whiskers, markers, and shapes - with paper crafting!

{% with pdf_file = "../craft-tutorial.pdf" %}
{% set solid_filepdf = '<i class="fas craft-tutorial"></i>' %}
{% set empty_filepdf = '<i class="far craft-tutorial"></i>' %}

<object data="{{ pdf_file }}" type="application/pdf" width="900" height="520">
    <embed src="{{ pdf_file }}" type="application/pdf" />
</object>

{% endwith %}

Credit: [Craft Tech Lab @ CU Boulder](https://cucraftlab.org/)

## Paper Organ Walkthrough

<figure>
<iframe width="877" height="493" src="https://www.youtube.com/embed/DnZdQ917vW8" title="Paper Playground - Paper Organ - *Creator* Walkthrough" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</figure>