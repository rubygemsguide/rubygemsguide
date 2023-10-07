---
layout: rest-man/post
title:  RubyGems.Guide | rest-man | SSL/TLS
author: Hopper Gee
categories: rest-man
permalink: /rest-man/advance/ssl-tls
---

<div class="post">
  <h2 class="title">SSL/TLS Support</h2>

  <div class="post-desc">
    {{site.data.rest_man.ssl_tls.description | markdownify}}
  </div>

  {% for example in site.data.rest_man.ssl_tls.examples %}
    {% include rest-man/request-example.md example=example index=forloop.index %}
  {% endfor %}
</div>
