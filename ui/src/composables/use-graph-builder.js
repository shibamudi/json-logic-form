import { jsonToGraphQLQuery } from 'json-to-graphql-query';
import useJsonLogic from './use-json-logic';

function useGraphBuilder(dataResource) {
  const { applyLogicDeep } = useJsonLogic(dataResource);

  function build(schema) {
    return jsonToGraphQLQuery(applyLogicDeep(schema));
  }

  return {
    build,
  };
}

export default useGraphBuilder;
