---
layout: rest-man/post
title:  RubyGems.Guide | rest-man | Redirection
author: Hopper Gee
categories: rest-man
permalink: /rest-man/redirection
---

<div class="post">
  <h2 class="title">Redirection</h2>

  <div class="post-desc">
    {{site.data.rest_man.redirection.description | markdownify}}
  </div>

  {% for example in site.data.rest_man.redirection.examples %}
    {% include rest-man/request-example.md example=example index=forloop.index %}
  {% endfor %}
</div>
