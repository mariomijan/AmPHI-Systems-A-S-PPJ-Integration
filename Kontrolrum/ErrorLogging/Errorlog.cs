using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.IO;

namespace Kontrolrum.ErrorLogging
{
    public class Errorlog
    {

        public void Error(string ppjError)
        {
            string filename = "Errorlog.txt";
            string userName = Environment.UserName;
            //string path = Path.Combine("C:\\Users\\" + userName + "\\Desktop\\", filename);
            string path = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, filename);


            if (File.Exists(path))
            {
                using (StreamWriter writer = new StreamWriter(path, true))
                {
                    writer.WriteLine(
                        "{0}:{1}",
                        DateTimeOffset.UtcNow,
                        ppjError
                        );
                }
            }
            else
            {
                using (StreamWriter writer = File.CreateText(path))
                {
                    writer.WriteLine(
                   "{0}:{1}",
                   DateTimeOffset.UtcNow,
                   ppjError
                        );
                }
            }

        }

    }
}

