module Jekyll
  class PostReader

    def read_posts(dir)
      read_publishable(dir, "_posts", Document::DATELESS_FILENAME_MATCHER)
    end

  end
end