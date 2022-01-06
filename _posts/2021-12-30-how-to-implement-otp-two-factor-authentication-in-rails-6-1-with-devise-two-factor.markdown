---
layout: post
title:  How to implement OTP two-factor authentication in Rails 6.1 with devise-two-factor
date:   2021-12-30 16:19:00 +0800
categories: devise-two-factor
author: Hopper Gee
---

> The source code could be found in the [rubygemsguide/devise-two-factor-demos](https://github.com/rubygemsguide/devise-two-factor-demos/tree/rails-6.1) repository under `rails-6.1` branch.

The 2FA feature contains below flows:

- Setup flow
  - Enable OTP-based two-factor authentication
  - Disable 2FA
  - Regenerate recovery codes
- Login flow
  - Login with OTP
  - Login with recovery code

[devise-two-factor](https://github.com/tinfoil/devise-two-factor)'s default way to do two-factor authentidation is put the email, password and OTP field on same page which is not the most common way to do 2FA login.

The common way is to allow users to sign in with or without 2FA. So we need to submit email and password first, then submit the 6 digit OTP code in second page.

So we need to do some customization base on devise-two-factor gem:

- Replace devise-two-factor `two_factor_authenticatable` strategy with `otp_attempt_authenticatable`
- Replace devise-two-factor `two_factor_backupable` strategy with `recovery_code_authenticatable`

Let's do it!

### Step 1: Start a Rails app with Devise

Build a new Rails 6 app without webpacker

```bash
mkdir two-factor-auth-rails-6
cd two-factor-auth-rails-6
touch Gemfile
echo "gem 'rails', '~> 6.1'" > Gemfile
bundle install
bundle exec rails new . -f --skip-javascript
```

Integrating `stimulus`

1. Add `stimulus` and `importmap` to Gemfile and run `bundle install`
 
   ```ruby
   # Gemfile
   gem 'importmap-rails', '~> 1.0'
   gem 'stimulus-rails', '~> 1.0'
   ```

2. Setup `importmap` and `stimulus` by run

   ```bash
   bin/rails importmap:install
   bin/rails stimulus:install
   ```

Integrating `devise`

1. Add `devise` to Gemfile and run `bundle install`

   ```ruby
   gem 'devise', '~> 4.8'
   ```

2. Setup `devise` by run

   ```bash
   bin/rails generate devise:install
   ```

3. Add mailer url config to `config/environments/development.rb`

   ```ruby
   # config/environments/development.rb
   config.action_mailer.default_url_options = { host: 'localhost', port: 3000 }
   ```

4. Generate `User` model through `devise` command

   ```bash
   bin/rails generate devise User
   bin/rails db:migrate
   ```

5. Update routes

   ```ruby
   # config/routes.rb
   devise_for :users
   ```
6. Add a before action `authenticate_user!`

   ```ruby
   # app/controllers/application_controller.rb
   class ApplicationController < ActionController::Base
     before_action :authenticate_user!
   end
   ```

Generate the home page 

1. Create a home controller: `rails g controller Home`
2. Update routes

   ```ruby
   # config/routes.rb
   root "home#show"
   ```

3. Create the view `app/views/home/show.html.erb`

   ```html
   <h1>Welcome to 2FA Demo!</h1>
   ```

4. Skip the devise authenticate before action

   ```ruby
   # app/controllers/home_controller.rb
   skip_before_action :authenticate_user!
   ```

Generate the dashboard page

1. Create a dashboard controller: `rails g controller Dashboard`
2. Update routes

   ```ruby
   resource :dashboard, controller: :dashboard
   ```
3. Create the view `app/views/dashboard/show.html.erb`

   ```html
   <h1>Dashboard</h1>
   ```
4. Redirect to dashboard page after sign in

   ```ruby
   # app/controllers/application_controller.rb
   private

   def after_sign_in_path_for(resource)
     dashboard_path
   end
   ```
5. Redirect to dashboard page on home page if user already signed in 

   ```ruby
   # app/controllers/home_controller.rb
   def show
     redirect_to dashboard_path if user_signed_in?
   end
   ```

Import [RubyGemsGuide/demo.css](https://github.com/RubyGemsGuide/demo.css/blob/main/demo.css)

1. `touch app/assets/stylesheets/demo.css`
2. Copy paste [demo.css](https://github.com/RubyGemsGuide/demo.css/blob/main/demo.css)
3. Update layout

   ```html
   <body>
     <header>
       <h1>
         <%= link_to '2FA Demo', root_path %>
       </h1>

       <nav>
         <% if user_signed_in? %>
           <%= button_to 'Logout', destroy_user_session_path, method: :delete %>
         <% else %>
           <%= link_to 'Login', new_user_session_path %>
         <% end %>
       </nav>
     </header>

     <section>
       <% flash.each do |name, msg| -%>
         <%= content_tag :dialog, msg, role: name %>
       <% end %>
     </section>

     <%= yield %>

     <footer>
       <a href="https://rubygems.guide">RubyGems.Guide</a> - 2FA Demo
     </footer>
   </body>
   ```

Start the app at `localhost:3000`

```bash
bin/rails s
# => Booting Puma
# => Rails 6.1.4.4 application starting in development
# => Run `bin/rails server --help` for more startup options
# Puma starting in single mode...
# * Puma version: 5.5.2 (ruby 3.0.1-p64) ("Zawgyi")
# *  Min threads: 5
# *  Max threads: 5
# *  Environment: development
# *          PID: 41093
# * Listening on http://127.0.0.1:3000
# * Listening on http://[::1]:3000
# Use Ctrl-C to stop
```

Now we have a basic Rails app that user can sign up, sign in and sign out.

![](/images/posts/devise-two-factor/home-page.png)

### Step 2: Install and setup devise-two-factor

1. Add `devise-two-factor`, `dotenv-rails`, `rqrcode` to Gemfile and run `bundle instll`

   ```ruby
   # Gemfile
   gem 'devise-two-factor', '~> 4.0'
   gem 'dotenv-rails'
   gem 'rqrcode', '~> 2.1'
   ```

2. Generate config and update `User` model by run:

   ```bash
   rails generate devise_two_factor User DEVISE_OTP_ENCRYPT_KEY
   ```

3. Create and update `.env` file

   ```ruby
   DEVISE_OTP_ENCRYPT_KEY=opt_encryption_key_must_be_32_bytes_or_longer
   ```

4. Add `otp_backup_codes` column to `users` and run `rails db:migrate`

   ```ruby
   class AddDeviseTwoFactorBackupableToUsers < ActiveRecord::Migration
     def change
       # Change type from :string to :text if using MySQL database
       add_column :users, :otp_backup_codes, :string, array: true
     end
   end
   ```

5. Add backup code config to `User` model

   ```ruby
   devise :two_factor_backupable,
          otp_backup_code_length: 8,
          otp_number_of_backup_codes: 12

   serialize :otp_backup_codes, Array
   ```


### Step 3: Enable OTP-based two-factor authentication

The user flow we want:

1. Find a link called "Two-factor authentication" on `/dashboard` page
2. Go to the 2FA setup page(`/two_factor_authentication`) by click the link
3. Find a 2FA "Enable" button on `/two_factor_authentication` page
4. Show a confirmation page by click the "Enable" button
5. See a QR code and a code submit form on the the confirmation page
6. Scan the QR code with an authenticator app and submit the form with a OTP code
7. Show a success page after succcess submit the confirmation form
8. Find 12 recovery codes and a "Done" button on the success page
9. Back to the 2FA setup page(`/two_factor_authentication`) after click the "Done" button

Create the 2FA setup page

1. Setup routes

   ```ruby
   # config/routes.rb
   resource :two_factor_authentication
   ```

2. Create the controller: `TwoFactorAuthenticationsController`

   ```ruby
   # app/controllers/two_factor_authentications_controller
   class TwoFactorAuthenticationsController < ApplicationController
     def show
     end
   end
   ```

3. Create the 2FA setup view `app/views/two_factor_authentications/show.html.erb`

   ```html
   <h1>Two-factor authentication</h1>
   ```
   ![](/images/posts/devise-two-factor/2FA-setup-page-v0.png)


4. Put the link on dashboard show page `app/views/dashboard/show.html.erb`

   ```erb
   <%= link_to "Two-factor authentication", two_factor_authentication_path %>
   ```

   ![](/images/posts/devise-two-factor/dashboard-page.png)

Now we can go to the 2FA setup page by click "Two-factor authentication" link on dashboard page

Show the 2FA confirmation view on enable

1. Add 2FA "Enable" button on 2FA setup page (`app/views/two_factor_authentications/show.html.erb`)

   ```html
   <h1>Two-factor authentication</h1>

   <h2>Authenticator app</h2>

   <%= button_to 'Enable', two_factor_authentication_path, method: :post %>
   ```

2. Add a `create` action to `TwoFactorAuthenticationsController`

   ```ruby
   # app/controllers/two_factor_authentications_controller
   def create
     current_user.otp_secret = User.generate_otp_secret
     current_user.save!

     @qrcode = current_user.otp_qrcode
     render 'two_factor_authentication/confirmations/new'
   end
   ```
    This will generate and save the OTP secret which will used for OTP authentication in future. Then it will redner the confirmation page.

3. Add `otp_qrcode` method to `User`

   ```ruby
   def otp_qrcode
     provision_uri = otp_provisioning_uri(email, issuer: '2FA-Demo')
     RQRCode::QRCode.new(provision_uri)
   end
   ```

4. Update routes to add the 2FA setup confirmation url

   ```diff
   - resource :two_factor_authentication
   + resource :two_factor_authentication do
   +   scope module: :two_factor_authentication do
   +     resource :confirmation
   +   end
   + end
   ```

5. Create the confirmation controller `TwoFactorAuthentication::ConfirmationsController`

   ```ruby
   # app/controllers/two_factor_authentication/confirmations_controller.rb
   class TwoFactorAuthentication::ConfirmationsController < ApplicationController
   end
   ```

6. Create an OTP field component

   ![](/images/posts/devise-two-factor/otp-field.png)

   A view partial at `app/views/components/_otp_field.html.erb`
   ```html
   <div data-controller="otp-digit-field"
       data-otp-digit-field-code-length-value="<%= code_length %>">
     <%= f.hidden_field field_name, id: 'otp-code-field', data: { 'otp-digit-field-target': 'mainField' } %>
     <div class="otp-digit-fields-container">
       <% (1..code_length).each do |index| %>
         <% 
           on_first = (index == 1)
           on_last = (index == code_length)
         %>

         <input
           type="text"
           maxLength="1"
           id="digit-<%= index %>"
           <%= %Q{data-previous="digit-#{index - 1}"}.html_safe unless on_first %>
           <%= %Q{data-next="digit-#{index + 1}"}.html_safe unless on_last %>
           <%= "autofocus" if on_first %>
           data-action="
             keydown->otp-digit-field#checkAllowance
             input->otp-digit-field#handleInputEvent
             keyup->otp-digit-field#handleKeyUp
           "
         >
       <% end %>
     </div>
   </div>
   ```

   With a Stimulus controller at `app/javascript/controllers/otp_digit_field_controller.js`

   ```js
   import { Controller } from "@hotwired/stimulus"

   export default class extends Controller {

     static targets = ['mainField']
     static values = {
       codeLength: String
     }

     checkAllowance(e) {
       if (!this._isValidOtpField(e.key)) {
         e.preventDefault();
       }
     }

     handleInputEvent(e) {
       const digitValue = e.data
       if (digitValue == null) { return; }

       if(('0' <= digitValue && digitValue <= '9') || ('a' <= digitValue && digitValue <= 'z')) {
         const next = this.element.querySelector(`input#${e.currentTarget.dataset.next}`)

         if(next !== null) {
           next.focus()
         }
       }

       this._updateMainField()
     }

     handleKeyUp(e) {
       if(e.key === 'Backspace' || e.key === 'ArrowLeft') {
         const prev = this.element.querySelector(`input#${e.currentTarget.dataset.previous}`)

         if(prev !== null) {
           prev.focus()
         }
       } else if(e.key === 'ArrowRight') {
         const next = this.element.querySelector(`input#${e.currentTarget.dataset.next}`)

         if(next !== null) {
           next.focus()
         }
       } else if(e.key === 'Enter' && this._allFieldsAreFilled()) {
         this.mainFieldTarget.form.submit()
       }
     }

     _updateMainField() {
       let otpCode = ''
       for (var i = 1; i < (Number(this.codeLengthValue) + 1); i += 1) {
         otpCode += this.element.querySelector(`input#digit-${i}`).value
       }

       this.mainFieldTarget.value = otpCode
     }

     _isValidOtpField(key) {
       return (key === 'Backspace') ||
               (key === 'ArrowLeft') ||
               (key === 'ArrowRight') ||
               ('0' <= key && key <= '9') ||
               ('a' <= key && key <= 'z');
     }

     _allFieldsAreFilled() {
       return this.mainFieldTarget.value.length === Number(this.codeLengthValue)
     }

   }
   ```

7. Add CSS for OTP digit field at `app/assets/stylesheets/two_factor_authentication.scss`

   ```scss
   // app/assets/stylesheets/two_factor_authentication.scss
   .otp-digit-fields-container {

     display: flex;
     margin-bottom: 1rem;

     input {
       width: 35px;
       height: 40px;
       line-height: 50px;
       text-align: center;
       font-size: 24px;
       font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
       font-weight: 200;
       margin: 2px;
     }

   }
   ```

8. Create the confirmation view at `app/views/two_factor_authentication/confirmations/new.html.erb`

   ```html
   <h1>Setup Two-Factor Authentication</h1>
   <p>Use your two-factor authentication app to scan the QR code</p>

   <%= @qrcode.as_svg(module_size: 3, fill: "ffffff").html_safe %>

   <%= form_with(
         url: two_factor_authentication_confirmation_path,
         local: true,
         method: :post
   ) do |f| %>
     <p>Enter 6-digit code from your two factor authenticator app.</p>

     <%= render 'components/otp_field', f: f, field_name: :otp_code, code_length: 6 %>

     <div>
       <%= f.button "Confirm and activate", type: :submit %>

       <%= link_to 'Cancel', two_factor_authentication_path %>
     </div>
   <% end %>
   ```

Now we have a 2FA setup confirmation page

![](/images/posts/devise-two-factor/2FA-setup-confirmation-page.png)

Next, we need to create the confirmation success page for confirmation code submit.

1. Add `create` action to `TwoFactorAuthentication::ConfirmationsController`

   ```ruby
   # app/controllers/two_factor_authentication/confirmations_controller.rb
   def create
     if current_user.validate_and_consume_otp!(params.dig(:otp_code))
       current_user.otp_required_for_login = true
       current_user.save!

       render "two_factor_authentication/confirmations/success"
     else
       flash.now[:alert] = "Failed to confirm the 2FA code"
       prepare_2fa_form
       render :new
     end
   end
   ```

2. Create the success page at `app/views/two_factor_authentication/confirmations/success.html.erb`

   ```html
   <h1>2FA Setup Success</h1>

   <%= link_to "Done", two_factor_authentication_path %>
   ```

Now, after scan the QR code, user can succesfully enable 2FA by submit the 6-digit confirmation code from the authenticator app

### Step 4: Generate and show recovery codes on the success page

![](/images/posts/devise-two-factor/2FA-setup-success-page.png)

Generate backup codes on submit confirmation at `app/controllers/two_factor_authentication/confirmations_controller.rb`

```diff
def create
  if current_user.validate_and_consume_otp!(params.dig(:otp_code))
    current_user.otp_required_for_login = true
+   @recovery_codes = current_user.generate_otp_backup_codes!
    current_user.save!

    render "two_factor_authentication/confirmations/success"
  else
    flash.now[:alert] = "Failed to confirm the 2FA code"
    prepare_2fa_form
    render :new
  end
end
```

Show backup codes on success view `app/views/two_factor_authentication/confirmations/success.html.erb`

```diff
  <h1>2FA Setup Success</h1>
+ <p>Save this emergency backup code and store it somewhere safe. If you lose your phone, you can use backup codes to sign in.</p>
+ 
+ <ul>
+   <% @recovery_codes.each do |code| %>
+     <li><%= code %></li>
+   <% end %>
+ </ul>

  <%= link_to "Done", two_factor_authentication_path %>
```

### Step 5: Login with an OTP token from an authenticator app

Create a new devise authentication strategy called `otp_attempt_authenticatable`

```ruby
# lib/devise-two-factor/strategies/otp_attempt_authenticatable.rb
module Devise
  module Strategies
    class OtpAttemptAuthenticatable < Devise::Strategies::Base

      def authenticate!
        resource = mapping.to.find(session[:otp_user_id])

        if validate_otp(resource)
          session[:otp_user_id] = nil
          session[:otp_user_id_expires_at] = nil
          success!(resource)
        else
          fail!('Failed to authenticate your code')
        end
      end

      private

      def validate_otp(resource)
        return true unless resource.otp_required_for_login
        return if params[scope]['otp_attempt'].nil?
        resource.validate_and_consume_otp!(params[scope]['otp_attempt'])
      end

    end
  end
end

Warden::Strategies.add(:otp_attempt_authenticatable, Devise::Strategies::OtpAttemptAuthenticatable)
```

Require this strategy file at the begining of the `config/initializers/devise.rb`

```ruby
require Rails.root.join("lib/devise-two-factor/strategies/otp_attempt_authenticatable.rb")
```

Customize devise session controller

1. Generate session controller by run

   ```bash
   bin/rails generate devise:controllers users -c=sessions
   ```
   Then we get 
   ```ruby
   # /app/controllers/users/sessions_controller.b
   class Users::SessionsController < Devise::SessionsController
   end
   ```
   We also need to update routes
   ```diff
   - devise_for :users
   + devise_for :users, controllers: {
   +   sessions: 'users/sessions'
   + }
   ```

2. Customize `Users::SessionsController#create`

   ```ruby
   # POST /resource/sign_in
   def create
     self.resource = warden.authenticate!(:database_authenticatable, auth_options)

     if resource.otp_required_for_login?
       sign_out(resource)
       session[:otp_user_id] = resource.id

       redirect_to users_sign_in_otp_path
     else
       set_flash_message!(:notice, :signed_in)
       sign_in(resource_name, resource)
       respond_with resource, location: after_sign_in_path_for(resource)
     end
   end
   ```

Create a OTP session page

1. Update routes

   ```ruby
   # config/routes.rb
   devise_scope :user do
     get '/users/sign_in/otp' => 'users/otp/sessions#new'
     post '/users/sign_in/otp' => 'users/otp/sessions#create'
   end
   ```

2. Create the controller `Users::Otp::SessionsController`

   ```ruby
   # app/controllers/users/otp/sessions_controller.rb
   class Users::Otp::SessionsController < DeviseController
     prepend_before_action :require_no_authentication, only: [:new, :create]

     def new
       unless User.exists?(session[:otp_user_id])
         session[:otp_user_id] = nil
         redirect_to new_user_session_path 
       end
     end

     def create
       resource = warden.authenticate!(
         :otp_attempt_authenticatable,
         {
           scope: resource_name,
           recall: "#{controller_path}#new"
         }
       )

       set_flash_message!(:notice, :signed_in)
       sign_in(resource_name, resource)
       respond_with resource, location: after_sign_in_path_for(resource)
     end

   end
   ```
   Now, it will redirectc to otp session new page after success authentication the email and password

3. Create the OPT session view at `app/views/users/otp/sessions/new.html.erb`

   ```html
   <h1>Authenticate your account</h1>

   <%= form_with(
         url: users_sign_in_otp_path,
         scope: :user,
         method: :post,
         local: true
   ) do |f| %>
     <p>Enter 6-digit code from your two factor authenticator app.</p>

     <%= render 'components/otp_field', f: f, field_name: :otp_attempt, code_length: 6 %>

     <%= f.submit 'Verify' %>
   <% end %>
   ```

Now we get a OTP login page

![](/images/posts/devise-two-factor/2FA-login-page.png)

### Step 6: Login with a recovery code

Login with recovery code is similar with login with OTP code

Create a new devise authentication strategy called `recovery_code_authenticatable`

```ruby
# lib/devise-two-factor/strategies/recovery_code_authenticatable.rb
module Devise
  module Strategies
    class RecoveryCodeAuthenticatable < Devise::Strategies::Base

      def authenticate!
        resource = mapping.to.find(session[:otp_user_id])

        if validate_recovery_code(resource)
          session[:otp_user_id] = nil
          session[:otp_user_id_expires_at] = nil
          success!(resource)
        else
          fail!('Failed to authenticate your code')
        end
      end

      private

      def validate_recovery_code(resource)
        return true unless resource.otp_required_for_login
        return if params[scope]['recovery_code'].nil?
        resource.invalidate_otp_backup_code!(params[scope]['recovery_code'])
      end

    end
  end
end

Warden::Strategies.add(:recovery_code_authenticatable, Devise::Strategies::RecoveryCodeAuthenticatable)
```

Require this strategy file at the begining of the `config/initializers/devise.rb`

```ruby
require Rails.root.join("lib/devise-two-factor/strategies/recovery_code_authenticatable.rb")
```

Update `config/routes.rb`

```diff
devise_scope :user do
  get '/users/sign_in/otp' => 'users/otp/sessions#new'
  post '/users/sign_in/otp' => 'users/otp/sessions#create'
+  get '/users/sign_in/recovery_code' => 'users/recovery_code/sessions#new'
+  post '/users/sign_in/recovery_code' => 'users/recovery_code/sessions#create'
end
```

Create the controller: `Users::RecoveryCode::SessionsController`

```ruby
# app/controllers/users/recovery_code/sessions_controller.rb
class Users::RecoveryCode::SessionsController < DeviseController
  prepend_before_action :require_no_authentication, only: [:new, :create]

  def new
    unless User.exists?(session[:otp_user_id])
      session[:otp_user_id] = nil
      redirect_to new_user_session_path 
    end
  end

  def create
    resource = warden.authenticate!(
      :recovery_code_authenticatable,
      {
        scope: resource_name,
        recall: "#{controller_path}#new"
      }
    )

    set_flash_message!(:notice, :signed_in)
    sign_in(resource_name, resource)
    respond_with resource, location: after_sign_in_path_for(resource)
  end

end
```

Create recovery code login page at `app/views/users/recovery_code/sessions/new.html.erb`

```html
<h1>Authenticate your account with a recovery code</h1>

<%= form_with(
      url: users_sign_in_recovery_code_path,
      scope: :user,
      method: :post,
      local: true
) do |f| %>
  <p>To access your account, enter one of the recovery codes you saved when you set up your two-factor authentication device.</p>

  <%= render 'components/otp_field', f: f, field_name: :recovery_code, code_length: 8 %>

  <%= f.submit 'Verify' %>
<% end %>
```

Add a login with recovery code link on otp login page at `app/views/users/otp/sessions/new.html.erb`

```diff
+ <div>
+   <p>Don't have your phone?</p>
+   <%= link_to "Use a recovery code to access your account.", users_sign_in_recovery_code_path %>
+ </div>
```

![](/images/posts/devise-two-factor/2FA-login-with-recovery-code-page.png)

Now we have finished basic feature of 2FA, congurationlatous. But we still have multiple things need to do. Let's go on.


### Step 7: Expire OTP session after 30 seconds

We need user to re-auth with email and password if an user hasn't pass the OTP authentication after30 seconds. It means we need to expire `session[:otp_user_id]` after 30 seconds.

So we need a concern for both `Users::Otp::SessionsController` and `Users::RecoveryCode::SessionsController`

```ruby
# app/controllers/concerns/otp_session_expirable.rb
module OtpSessionExpirable
  extend ActiveSupport::Concern

  included do
    private

    def expire_otp_session!
      return unless session[:otp_user_id]
      return unless session[:otp_user_id_expires_at]
      if session[:otp_user_id_expires_at] < Time.current
        session[:otp_user_id] = nil
        session[:otp_user_id_expires_at] = nil

        redirect_to new_user_session_path
      end
    end
  end
end
```

Apply `OtpSessionExpirable` to two OTP session controllers

```diff
class Users::Otp::SessionsController < DeviseController
+   include OtpSessionExpirable
+   before_action :expire_otp_session!

  # ...
end

class Users::RecoveryCodes::SessionsController < DeviseController
+   include OtpSessionExpirable
+   before_action :expire_otp_session!

  # ...
end
```

Then set expires_at on `Users::SessionsController`

```diff
def create
  self.resource = warden.authenticate!(:database_authenticatable, auth_options)

  if resource.otp_required_for_login?
    sign_out(resource)
    session[:otp_user_id] = resource.id
+    session[:otp_user_id_expires_at] = 30.seconds.after

    redirect_to users_sign_in_otp_path
  else
    set_flash_message!(:notice, :signed_in)
    sign_in(resource_name, resource)
    respond_with resource, location: after_sign_in_path_for(resource)
  end
end
```

### Step 8: Regenerate recovery codes

![](/images/posts/devise-two-factor/2FA-setup-page-v1.png)

Put the "regenerate" button on 2FA setup page at `app/controllers/two_factor_authentications/show.html.erb`

```diff
+ <% if current_user.otp_required_for_login %>
+   <h2>Recovery codes</h2>
+ 
+   <%= button_to "Regenerate", two_factor_authentication_recovery_codes_path, method: :post %>
+ <% end %>
```

Update `config/routes`

```diff
resource :two_factor_authentication do
  scope module: :two_factor_authentication do
    resource :confirmation
+    resources :recovery_codes
  end
end
```

Create the controller: `TwoFactorAuthentication::RecoveryCodesController`

```ruby
# app/controllers/two_factor_authentication/recovery_codes_controller.rb
class TwoFactorAuthentication::RecoveryCodesController < ApplicationController
  def create
    @recovery_codes = current_user.generate_otp_backup_codes!
    current_user.save!
    render :index
  end
end
```

Create the index view at `app/views/two_factor_authentication/recovery_codes/index.html.erb`

```html
<h1>Regenerate Recovery Codes Success</h1>

<p>Save this emergency backup code and store it somewhere safe. (All previous codes are expired.)</p>

<ul>
  <% @recovery_codes.each do |code| %>
    <li><%= code %></li>
  <% end %>
</ul>

<%= link_to "Done", two_factor_authentication_path %>
```

### Step 9: Disable 2FA

Add "Disable" button on 2FA setup page at `app/controllers/two_factor_authentications/show.html.erb`

```diff
- <%= button_to 'Enable', two_factor_authentication_path, method: :post %>
+ <% if current_user.otp_required_for_login %>
+   <%= button_to "Disable", two_factor_authentication_path, method: :delete %>
+ <% else %>
+   <%= button_to 'Enable', two_factor_authentication_path, method: :post %>
+ <% end %>
```

Add `destroy` action to `TwoFactorAuthenticationsController`

```ruby
# app/controllers/two_factor_authentications_controller.rb
class TwoFactorAuthenticationsController < ApplicationController

  # ...

  def destroy
    current_user.otp_required_for_login = false
    current_user.otp_backup_codes&.clear
    current_user.save!
    redirect_to two_factor_authentication_path
  end
end
```

### Step 10: Fix two page refresh issues

Fix a refresh issue on `/two_factor/authentication/confirmations` after a failed submit

```ruby
# app/controllers/two_factor_authentication/confirmations_controller.rb
def show
  redirect_to two_factor_authentication_path
end
```

Fix another refresh issue on `/two_factor_authentication/recovery_codes` after a failed submit

```ruby
# app/controllers/two_factor_authentication/recovery_codes_controller.rb
def index
  redirect_to two_factor_authentication_path
end
```

### Step 11: Refactor routes to only allow specific actions

```diff
- resource :two_factor_authentication do
-   scope module: :two_factor_authentication do
-     resource :confirmation
-     resources :recovery_codes
-   end
- end
+ resource :two_factor_authentication, only: [:show, :create, :destroy] do
+   scope module: :two_factor_authentication do
+     resource :confirmation, only: [:create, :show]
+     resources :recovery_codes, only: [:create, :index]
+   end
+ end
```

### Step 12: How to write system tests for 2FA login?

Here is all system tests for two-factor authentication.

Create a authentication system helper

```ruby
# test/support/helpers/system/authentication_system_helper.rb
module AuthenticationSystemHelper
  def scan_the_qr_code_and_get_an_onetime_token(user)
    user.reload.current_otp
  end

  def get_an_onetime_token_from_authenticator_app(user)
    user.reload.current_otp
  end

  def fill_in_digit_fields_with(number)
    chars = number.to_s.split('')

    chars.each.with_index do |char, index|
      fill_in "digit-#{index + 1}", with: char
    end
  end

  def setup_2fa(user)
    user.otp_secret = User.generate_otp_secret
    user.otp_required_for_login = true
    user.generate_otp_backup_codes!
    user.save!
  end
end
```

Include the helper for system tests

```diff
require "test_helper"
+ require "support/helpers/system/authentication_system_helper"

class ApplicationSystemTestCase < ActionDispatch::SystemTestCase
+  include Devise::Test::IntegrationHelpers
+  include AuthenticationSystemHelper

  driven_by :selenium, using: :chrome, screen_size: [1400, 1400]
end
```

Create 2FA setup and login tests

```ruby
# test/system/two_factor_auth/setup_2fa_test.rb
require 'application_system_test_case'

class Setup2FATest < ApplicationSystemTestCase

  setup do
    @hopper = users(:hopper)
    sign_in @hopper
  end

  test "can success setup 2FA and login with it" do
    visit root_path
    assert_selector "h1", text: "Dashboard"

    click_link "Two-factor authentication"
    assert_selector "h1", text: "Two-factor authentication"
    assert_selector "h2", text: "Authenticator app"

    click_on "Enable"
    assert_selector "h1", text: "Setup Two-Factor Authentication"
    assert_selector "p", text: "Use your two-factor authentication app to scan the QR code"

    click_on "Cancel"
    assert_selector "h1", text: "Two-factor authentication"
    assert_equal two_factor_authentication_path, page.current_path

    click_on "Enable"
    assert_selector "h1", text: "Setup Two-Factor Authentication"

    token = scan_the_qr_code_and_get_an_onetime_token(@hopper)
    fill_in_digit_fields_with token
    click_button "Confirm and activate"
    assert_selector "h1", text: "2FA Setup Success"
    assert_selector "p", text: "Save this emergency backup code and store it somewhere safe."
    assert_selector "li", count: 12
    all("li").each do |li|
      assert_match /\w{8}/, li.text
    end

    click_on "Done"
    assert_selector "h1", text: "Two-factor authentication"
    assert_selector "h2", text: "Authenticator app"
    assert_button "Disable"
    assert_selector "h2", text: "Recovery codes"
    assert_button "Regenerate"

    click_on "Regenerate" # Regenerate recovery codes
    assert_selector "h1", text: "Regenerate Recovery Codes Success"
    assert_selector "p", text: "Save this emergency backup code and store it somewhere safe. (All previous codes are expired.)"
    assert_selector "li", count: 12
    save_recovery_codes

    click_on "Done"
    assert_selector "h1", text: "Two-factor authentication"

    ####################
    ## Login with 2FA ##
    ####################

    click_on "Logout"
    assert_content "Signed out successfully."

    click_on "Login"
    assert_selector "h2", text: "Log in"

    travel_to 30.seconds.after do
      fill_in 'Email', with: 'hopper@example.com'
      fill_in 'Password', with: '12345678'
      click_button "Log in"
      assert_selector "h1", text: "Authenticate your account"
      assert_selector "p", text: "Enter 6-digit code from your two factor authenticator app."

      fill_in_digit_fields_with '111111'
      click_button "Verify"
      assert_content "Failed to authenticate your code"

      token = get_an_onetime_token_from_authenticator_app(@hopper)
      fill_in_digit_fields_with token
      click_button "Verify"
      assert_selector "h1", text: "Dashboard"
      assert_equal dashboard_path, page.current_path
    end

    ##############################
    ## Login with a backup code ##
    ##############################
    click_on "Logout"
    assert_content "Signed out successfully."

    click_on "Login"
    assert_selector "h2", text: "Log in"

    fill_in 'Email', with: 'hopper@example.com'
    fill_in 'Password', with: '12345678'
    click_button "Log in"
    assert_selector "h1", text: "Authenticate your account"
    assert_selector "p", text: "Enter 6-digit code from your two factor authenticator app."

    click_link "Use a recovery code to access your account."
    assert_selector "h1", text: "Authenticate your account with a recovery code"
    assert_selector "p", text: "To access your account, enter one of the recovery codes you saved when you set up your two-factor authentication device."

    fill_in_digit_fields_with '1234abcd'
    click_button "Verify"
    assert_content "Failed to authenticate your code"

    fill_in_digit_fields_with @recovery_codes.pop
    click_button "Verify"
    assert_selector "h1", text: "Dashboard"
    assert_equal dashboard_path, page.current_path
  end

  def save_recovery_codes
    @recovery_codes = all("li").map(&:text)
  end

end

```

Create Disable 2FA tests

```ruby
# test/system/two_factor_auth/disable_2fa_test.rb
require 'application_system_test_case'

class Disable2FATest < ApplicationSystemTestCase

  setup do
    @hopper = users(:hopper)
    setup_2fa(@hopper)
    sign_in(@hopper)
  end

  test "can success disable 2FA and login without 2FA" do
    visit two_factor_authentication_path
    assert_selector "h1", text: "Two-factor authentication"
    assert_selector "h2", text: "Authenticator app"
    assert_selector "h2", text: "Recovery codes"

    click_on "Disable"
    assert_button "Enable"

    click_on "Logout"
    assert_content "Signed out successfully."

    click_on "Login"
    assert_selector "h2", text: "Log in"

    fill_in "Email", with: "hopper@example.com"
    fill_in "Password", with: "12345678"
    click_button "Log in"
    assert_selector "h1", text: "Dashboard"

    click_link "Two-factor authentication"
    assert_selector "h1", text: "Two-factor authentication"
    assert_button "Enable"
  end

end

```

Create OTP session expiration tests

```ruby
# test/system/two_factor_auth/otp_session_expiration_test.rb
require 'application_system_test_case'

class OTPSessionExpiration < ApplicationSystemTestCase

  setup do
    @hopper = users(:hopper)
    setup_2fa(@hopper)
  end

  test "expire after 30 seconds on OTP login page" do
    visit root_path
    assert_content "Welcome to 2FA Demo!"

    click_on "Login"
    assert_selector "h2", text: "Log in"

    fill_in "Email", with: "hopper@example.com"
    fill_in "Password", with: "12345678"
    click_button "Log in"
    assert_selector "h1", text: "Authenticate your account"
    assert_selector "p", text: "Enter 6-digit code from your two factor authenticator app."

    refresh
    assert_selector "h1", text: "Authenticate your account"
    assert_selector "p", text: "Enter 6-digit code from your two factor authenticator app."
    assert_equal "/users/sign_in/otp", page.current_path

    travel_to 31.seconds.after do
      refresh
      assert_selector "h2", text: "Log in"
      assert_equal "/users/sign_in", page.current_path
    end
  end

  test "expire after 30 seconds on recovery codee login page" do
    visit root_path
    assert_content "Welcome to 2FA Demo!"

    click_on "Login"
    assert_selector "h2", text: "Log in"

    fill_in "Email", with: "hopper@example.com"
    fill_in "Password", with: "12345678"
    click_button "Log in"
    assert_selector "h1", text: "Authenticate your account"
    assert_selector "p", text: "Enter 6-digit code from your two factor authenticator app."

    click_link "Use a recovery code to access your account."
    assert_selector "h1", text: "Authenticate your account with a recovery code"
    assert_selector "p", text: "To access your account, enter one of the recovery codes you saved when you set up your two-factor authentication device."

    refresh
    assert_selector "h1", text: "Authenticate your account with a recovery code"
    assert_selector "p", text: "To access your account, enter one of the recovery codes you saved when you set up your two-factor authentication device."
    assert_equal "/users/sign_in/recovery_code", page.current_path

    travel_to 31.seconds.after do
      refresh
      assert_selector "h2", text: "Log in"
      assert_equal "/users/sign_in", page.current_path
    end
  end

end
```

Update user fixtures at `test/fixtures/users.yml`

```yaml
hopper:
  email: hopper@example.com
  encrypted_password: <%= Devise::Encryptor.digest(User, '12345678') %>
  created_at: <%= 10.days.ago.strftime("%Y-%m-%d %H:%M:%S") %>
```

### Summary

#### Flow design overview
##### 2FA Enable

![](/images/posts/devise-two-factor/flows/dashboard-to-2fa.png)

|  | From | To |
| URL | /dashboard | /two_factor_authentication |
| Controller | DashBoard#show | TwoFactorAuthentications#show |
| Render | dashboard/show | two_factor_authentication/show |

![](/images/posts/devise-two-factor/flows/2FA-to-setup-confirm.png)

|  | From | To |
| URL | /two_factor_authentication | /two_factor_authentication |
| Controller | TwoFactorAuthentications#show | TwoFactorAuthentications#create |
| Render | two_factor_authentication/show | two_factor_authentication/confirmations/show |

![](/images/posts/devise-two-factor/flows/2FA-setup-success.png)

|  | From | To |
| URL | /two_factor_authentication | /two_factor_authentication/confirmation |
| Controller | TwoFactorAuthentications#create | TwoFactorAuthentications/Confirmation#create |
| Render | two_factor_authentication/confirmations/show | two_factor_authentication/confirmations/success |

##### 2FA Disable

![](/images/posts/devise-two-factor/flows/disable-2FA.png)

|  | From | To |
| URL | /two_factor_authentication | /two_factor_authentication |
| Controller | TwoFactorAuthentications#show | TwoFactorAuthentications#destroy -> #show |
| Render | two_factor_authentication/show | two_factor_authentication/show |

##### Regenerate recovery codes

![](/images/posts/devise-two-factor/flows/regenerate-recovery-codes.png)

|  | From | To |
| URL | /two_factor_authentication | /two_factor_authentication/recovery_codes |
| Controller | TwoFactorAuthentications#show | TwoFactorAuthentications/RecoveryCodes#create |
| Render | two_factor_authentication/show | two_factor_authentication/recovery_codes/index |

##### Login with 2FA

![](/images/posts/devise-two-factor/flows/login-with-email-and-password.png)

|  | From | To |
| URL | /users/sign_in | /users/sign_in/otp |
| Controller | users/sessions#new | users/sessions#create -> users/otp/sessions#new |
| Render | devise/sessions/new | users/otp/sessions/new |

![](/images/posts/devise-two-factor/flows/login-with-otp-code.png)

|  | From | To |
| URL | /users/sign_in/otp | /dashboard |
| Controller | users/otp/sessions#new | users/otp/sessions#create -> dashboard#show |
| Render | users/otp/sessions/new | dashbord/show |

##### Login with recovery code

![](/images/posts/devise-two-factor/flows/go-to-recovery-code-login-page.png)

|  | From | To |
| URL | /users/sign_in/otp | /users/sign_in/recovery_code |
| Controller | users/otp/sessions#new | users/recovery_code/sessions#new |
| Render | users/otp/sessions/new | users/recovery_code/sessions/new |

![](/images/posts/devise-two-factor/flows/login-with-recovery-code.png)

|  | From | To |
| URL | /users/sign_in/recovery_code | /dashboard |
| Controller | users/recovery_code/sessions#new | users/recovery_code/sessions#create -> dashboard#show |
| Render | users/recovery_code/sessions/new | dashboard/show |

#### Database schema overview

```ruby
create_table "users" do |t|
  # ...
  t.string "encrypted_otp_secret"
  t.string "encrypted_otp_secret_iv"
  t.string "encrypted_otp_secret_salt"
  t.integer "consumed_timestep"
  t.boolean "otp_required_for_login"
  t.text "otp_backup_codes"
end
``` 