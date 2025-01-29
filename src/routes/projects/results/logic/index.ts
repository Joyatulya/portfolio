import { Engine } from "json-rules-engine";


export async function hello_world_rules_engine() {
  const engine = new Engine()

  engine.addRule({
    conditions: {
      any: [{
        fact: 'weight',
        operator: 'greaterThan',
        value: 60
      }]
    },
    event: {
      type: 'message',
      params: {
        data: 'You are Fat!'
      }
    }
  })
  const facts = { weight: 70 }

  const { events } = await engine.run(facts)

  console.log(events)
}
