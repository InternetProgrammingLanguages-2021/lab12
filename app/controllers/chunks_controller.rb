class ChunksController < ApplicationController
  before_action :authorize_request
  
  def index
    query = request.query_parameters['q']
    return render json: { error: 'no query provided' } unless query.is_a?(String)

    input = query
            .split(',')
            .map(&:to_f)
    chunks = input
             .chunk_while { |previous, current| previous < current }
    render json: { input: input,
                   chunks: chunks,
                   max_length: chunks.max_by(&:length) }
  end
end
