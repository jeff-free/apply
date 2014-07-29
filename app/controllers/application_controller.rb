class ApplicationController < ActionController::Base
  protect_from_forgery
  before_filter :set_language

  def set_language
    if params.has_key?(:lang)
      session[:language] = params[:lang] if I18n.available_locales.include?(params[:lang].to_sym)
    end

    if session[:language] && I18n.available_locales.include?(session[:language].to_sym)
      I18n.locale = session[:language]
    else
      I18n.locale = I18n.default_locale
      session[:language] = I18n.locale
    end
  end
end
