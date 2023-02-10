import { PythonShell } from 'python-shell';

export async function getPersonalityDestination(
  userId,
  start,
  end,
  tag,
  planId,
) {
  const result = await new Promise((resolve, reject) => {
    PythonShell.run(
      'personalization.py',
      {
        mode: 'text',
        scriptPath: 'src/util/python',
        args: [
          JSON.stringify({ userId }),
          JSON.stringify({ start }),
          JSON.stringify({ end }),
          JSON.stringify({ tag }),
          JSON.stringify({ planId }),
        ],
      },
      function (err, data) {
        const temp = [];
        for (let i = 0; i < data.length; i++) {
          temp.push(JSON.parse(data[i]));
        }
        return resolve(temp);
      },
    );
  });
  return result;
}
