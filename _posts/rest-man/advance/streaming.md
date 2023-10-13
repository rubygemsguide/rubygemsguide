---
layout: rest-man/post
title:  RubyGems.Guide | rest-man | Streaming
author: Hopper Gee
categories: rest-man
permalink: /rest-man/advance/streaming
---

<div class="post">
  <h2 class="title">Streaming</h2>

  {% if site.data.rest_man.streaming.description %}
    <div class="post-desc">
      {{site.data.rest_man.streaming.description | markdownify}}
    </div>
  {% endif %}

  {% for example in site.data.rest_man.streaming.examples %}
    {% include rest-man/request-example.md example=example index=forloop.index %}
  {% endfor %}
</div>
