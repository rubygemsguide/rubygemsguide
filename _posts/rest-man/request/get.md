---
layout: rest-man/post
title:  RubyGems.Guide | rest-man | GET
author: Hopper Gee
categories: rest-man
permalink: /rest-man/request/get
---

<h2 class="title">GET</h2>

<div class="example-section">
  <div class="request-box">
    <div class="http-method">GET</div>
    <div class="request-target">/test</div>
    <div class="http-version">HTTP/1.1</div>
    <div class="http-header">
      Host: example.com
    </div>
  </div>

  <div class="code-box">
    <div class="request-code">
      response = RestMan.get "http://example.com"
    </div>
    <div class="request-arrow">
      {% include rest-man/arrow-right.html %}
    </div>
    <div class="response-code">
      <div class="response-code-title">Response</div>

      <div class="code-call">response.status</div>
      <div class="code-output-indicator">#=></div>
      <div class="code-output">200</div>

      <div class="code-call">response.headers</div>
      <div class="code-output-indicator">#=></div>
      <div class="code-output">Hash</div>

      <div class="code-call">response.headers[:content_type]</div>
      <div class="code-output-indicator">#=></div>
      <div class="code-output">text/plain</div>

      <div class="code-call">response.body</div>
      <div class="code-output-indicator">#=></div>
      <div class="code-output">Hello world!</div>
    </div>
  </div>

  <div class="response-box">
    <div class="http-version">HTTP/1.1</div>
    <div class="status-code">200</div>
    <div class="status-text">OK</div>
    <div class="http-header">
      Content-Type: text/plain
    </div>
    <div class="http-body">Hello world!</div>
  </div>
</div>