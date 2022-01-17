require "selenium-webdriver"
require "test_helper"

class SeleniumTest < ActionDispatch::IntegrationTest
  def setup
    @driver = Selenium::WebDriver.for :firefox
  end

  test "should see title" do
    @driver.navigate.to "http://localhost:3000"
    assert_equal "ЛР 12", @driver.title
  end

  test "should find buttons" do
    @driver.navigate.to "http://localhost:3000"
    assert_equal ["ВОЙТИ"], @driver.find_elements(:tag_name, "button").map(&:text)
  end

  def teardown
    @driver.quit
  end
end
