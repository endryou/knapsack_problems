import random


def main():
	for f in range(1, 11):
		outfile = open('2500_'+(str(f))+'.txt', 'w')
		items = 2500

		for i in range(items):
			num = random.randint(40, 160)
			num2 = random.randint(20, 30)
			outfile.write(str(num)+' '+str(num2)+'\n')
		outfile.close()
		print('data written to file 5000_'+(str(f))+'.txt')

main()
