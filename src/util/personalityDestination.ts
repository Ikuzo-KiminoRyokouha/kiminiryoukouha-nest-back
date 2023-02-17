import { PythonShell } from 'python-shell';
import { throwError } from 'rxjs';

export async function getPersonalityDestination(
  userId,
  start,
  end,
  tag,
  planId,
) {
  const result = await new Promise((resolve, reject) => {
    try {
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
          if (err) console.log(err);
          console.log(data);
          const temp = [];
          for (let i = 0; i < data.length; i++) {
            temp.push(JSON.parse(data[i]));
          }
          return resolve(temp);
        },
      );
    } catch (error) {
      console.log(error);
      throwError;
    }
  });
  return result;
}
