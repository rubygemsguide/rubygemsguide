---
layout: rest-man/post
title:  RubyGems.Guide | rest-man | HTTP Status
author: Hopper Gee
categories: rest-man
permalink: /rest-man/http-status
---

<div class="post">
  <h2 class="title">Status Code</h2>

  <table class="http-status-table">
    <tbody>
      {% for status_code_group in site.data.rest_man.status_code %}
        <tr>
          <td colspan="3" class="http-status-category" id="{{status_code_group.category}}">{{status_code_group.title}}</td>
        </tr>
        {% for item in status_code_group.items %}
          <tr class="http-status-{{status_code_group.category}}">
            <td class="http-status-code">{{item.code}}</td>
            <td class="http-status-class">{{item.class}}</td>
            <td class="http-status-message">{{item.message}}</td>
          </tr>
        {% endfor %}
      {% endfor %}
    </tbody>
  </table>

</div>
