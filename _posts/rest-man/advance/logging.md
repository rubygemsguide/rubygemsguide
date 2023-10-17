---
layout: rest-man/post
title:  RubyGems.Guide | rest-man | Logging
author: Hopper Gee
categories: rest-man
permalink: /rest-man/logging
---

<div class="post">
  <h2 class="title">Logging</h2>

  {% if site.data.rest_man.logging.description %}
    <div class="post-desc">
      {{site.data.rest_man.logging.description | markdownify}}
    </div>
  {% endif %}

  {% for example in site.data.rest_man.logging.examples %}
    {% include rest-man/request-example.md example=example index=forloop.index %}
  {% endfor %}
</div>
