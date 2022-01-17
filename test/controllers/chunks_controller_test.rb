require "test_helper"

class ChunksControllerTest < ActionDispatch::IntegrationTest
  test "error without jwt" do
    get chunks_index_url, as: :json
    assert_response 401
    assert_equal 'application/json', @response.media_type
    assert_includes @response.body, 'errors'
  end
end
